import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const AIChat = forwardRef(function AIChat(
    { suggestions = [], currentUser },
    ref
) {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);

    const scrollRef = useRef(null);

    const isEmpty = messages.length === 0;

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop =
                scrollRef.current.scrollHeight;
        }
    }, [messages, typing]);

    useImperativeHandle(ref, () => ({
        sendMessage: (text) => handleSend(text),
    }));

    const handleSend = async (
        text,
        file = null,
        baseMessages = null
    ) => {
        if (!text.trim() && !file) return;

        const base = baseMessages ?? messages;

        const isImageFile =
            file && file.type.startsWith("image/");

        const userMessage = {
            id: Date.now(),
            sender: "user",
            message: text,
            time: "Now",
            imagePreview: isImageFile
                ? URL.createObjectURL(file)
                : null,
            attachedFile: file || null,
            fileName:
                file && !isImageFile
                    ? file.name
                    : null,
        };

        setMessages([...base, userMessage]);

        setTyping(true);

        try {
            const chatHistory = [...base, userMessage].map(
                (msg) => ({
                    role:
                        msg.sender === "user"
                            ? "user"
                            : "assistant",
                    content: msg.message,
                })
            );

            let location = null;

            const weatherWords = [
                "weather",
                "temperature",
                "temp",
                "humidity",
                "wind",
                "rain",
                "forecast",
            ];

            const isWeather = weatherWords.some((word) =>
                text.toLowerCase().includes(word)
            );

            if (isWeather && !file) {
                try {
                    location = await getUserLocation();
                } catch {
                    location = null;
                }
            }

            const formData = new FormData();

            formData.append("message", text);
            formData.append(
                "history",
                JSON.stringify(chatHistory)
            );
            formData.append(
                "location",
                JSON.stringify(location)
            );

            if (file) {
                formData.append("file", file);
            }

            const res = await axios.post(
                "https://atmosai-80iq.onrender.com/api/chat",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            const aiReply = {
                id: Date.now() + 1,
                sender: "ai",
                message: res.data.reply,
                time: "Now",
            };

            setMessages((prev) => [
                ...prev,
                aiReply,
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "ai",
                    message:
                        "❌ Unable to connect to AtmosAI. Please try again.",
                    time: "Now",
                },
            ]);
        } finally {
            setTyping(false);
        }
    };

    const handleEditMessage = (
        id,
        newText,
        newFile
    ) => {
        const idx = messages.findIndex(
            (m) => m.id === id
        );

        if (idx === -1) return;

        const truncated = messages.slice(0, idx);

        handleSend(
            newText,
            newFile,
            truncated
        );
    };

    return (
        <div
            className="
                relative
                flex-1
                min-h-0
                flex
                flex-col
                w-full
                overflow-hidden
            "
        >

            {/* ================================================= */}
            {/* EMPTY CHAT */}
            {/* ================================================= */}

            {isEmpty ? (
                <div
                    className="
                        flex-1
                        min-h-0
                        flex
                        flex-col
                        items-center
                        justify-start
                        sm:justify-center
                        pt-[8vh]
                        sm:pt-0
                        gap-5
                        sm:gap-7
                        px-4
                        sm:px-6
                        overflow-y-auto
                        pb-2
                    "
                >

                    {/* Intro */}
                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            text-center
                            gap-2.5
                            w-full
                            max-w-lg
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                sm:w-14
                                sm:h-14
                                mb-1
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <img
                                src="/ai_logo.png"
                                alt="AtmosAI"
                                className="
                                    h-12
                                    w-12
                                    sm:h-14
                                    sm:w-14
                                    object-contain
                                "
                            />
                        </div>

                        <h1
                            className="
                                text-white
                                text-2xl
                                sm:text-3xl
                                font-bold
                            "
                        >
                            Ask{" "}
                            <span className="gradient-text-blue">
                                AtmosAI
                            </span>
                        </h1>

                        <p
                            className="
                                text-gray-400
                                text-xs
                                sm:text-sm
                                leading-5
                                max-w-[340px]
                                sm:max-w-lg
                            "
                        >
                            Your personal weather assistant —
                            ask about temperature, AQI, humidity,
                            wind, or forecasts, anytime.
                        </p>
                    </div>


                    {/* ================================================= */}
                    {/* SUGGESTIONS */}
                    {/* ================================================= */}

                    {suggestions.length > 0 && (
                        <div
                            className="
                                flex
                                flex-wrap
                                justify-center
                                gap-2
                                sm:gap-2.5
                                w-full
                                max-w-2xl
                                px-1
                            "
                        >
                            {suggestions.map(
                                ({
                                    icon: Icon,
                                    label,
                                    text,
                                }) => (
                                    <button
                                        key={label}
                                        onClick={() =>
                                            handleSend(text)
                                        }
                                        className="
                                            group
                                            flex
                                            items-center
                                            gap-1.5
                                            sm:gap-2
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            px-3
                                            sm:px-4
                                            py-2
                                            text-[11px]
                                            sm:text-[13px]
                                            text-gray-300
                                            backdrop-blur-xl
                                            transition-all
                                            duration-300
                                            hover:border-sky-400/40
                                            hover:bg-white/[0.08]
                                            hover:text-white
                                            cursor-pointer
                                            whitespace-nowrap
                                        "
                                    >
                                        <Icon
                                            size={13}
                                            className="
                                                sm:w-[14px]
                                                sm:h-[14px]
                                                text-sky-400
                                                transition-transform
                                                duration-300
                                                group-hover:scale-110
                                                shrink-0
                                            "
                                        />

                                        {label}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            ) : (

                /* ================================================= */
                /* CHAT MESSAGES */
                /* ================================================= */

                <div
                    ref={scrollRef}
                    className="
                        flex-1
                        min-h-0
                        overflow-y-auto
                        px-3
                        sm:px-4
                        md:px-8
                    "
                >
                    <div
                        className="
                            max-w-5xl
                            mx-auto
                            py-4
                            sm:py-6
                            space-y-4
                            sm:space-y-5
                        "
                    >
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                id={msg.id}
                                sender={msg.sender}
                                message={msg.message}
                                time={msg.time}
                                avatar={currentUser?.avatar}
                                userName={currentUser?.name}
                                imagePreview={
                                    msg.imagePreview
                                }
                                attachedFile={
                                    msg.attachedFile
                                }
                                fileName={msg.fileName}
                                onSaveEdit={
                                    handleEditMessage
                                }
                            />
                        ))}

                        {typing && <TypingIndicator />}
                    </div>
                </div>
            )}


            {/* ================================================= */}
            {/* CHAT INPUT */}
            {/* ================================================= */}

            <div
                className="
                    shrink-0
                    w-full
                    max-w-5xl
                    mx-auto
                    px-3
                    sm:px-4
                    md:px-8
                    pb-3
                    sm:pb-4
                "
            >
                <ChatInput onSend={handleSend} />
            </div>

        </div>
    );
});

export default AIChat;