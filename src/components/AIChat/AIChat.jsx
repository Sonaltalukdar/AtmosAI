import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";


function AIChat() {

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            message:
                "👋 Welcome back, Sonal!\n\nI'm AtmosAI. Ask me anything about weather, AQI, humidity, wind or forecasts.",
            time: "Now",
        },
    ]);

    const [typing, setTyping] = useState(false);

    const chatRef = useRef(null);


    // Auto scroll
    useEffect(() => {

        if (chatRef.current) {

            chatRef.current.scrollTop =
                chatRef.current.scrollHeight;

        }

    }, [messages, typing]);



    // Send Message
    const handleSend = (text) => {

        if (!text.trim()) return;


        const userMessage = {

            id: Date.now(),

            sender: "user",

            message: text,

            time: "Now",

        };


        setMessages((prev) => [
            ...prev,
            userMessage
        ]);


        setTyping(true);



        // Temporary AI Reply

        setTimeout(() => {


            const aiReply = {

                id: Date.now() + 1,

                sender: "ai",

                message:
                    "🌤 Weather update\n\n🌡 Temperature: 31°C\n💧 Humidity: 74%\n🌬 Wind: 13 km/h\n🌫 AQI: 48\n\nNo heavy rainfall expected.",

                time: "Now",

            };


            setTyping(false);


            setMessages((prev) => [
                ...prev,
                aiReply
            ]);


        }, 1500);


    };



    return (

        <div
            className="
            chat-box-in
            h-full
            flex
            flex-col
            rounded-[32px]
          bg-white/[0.04]
            border
          border-white/10
            backdrop-blur-xl
            overflow-hidden
            p-0
            "
        >


            {/* Header */}

            <ChatHeader />



            {/* Messages */}

            <div
                ref={chatRef}
                className="
                flex-1
                overflow-y-auto
                px-5
                py-6
                space-y-5
                "
            >


                {
                    messages.map((msg) => (

                        <MessageBubble

                            key={msg.id}

                            sender={msg.sender}

                            message={msg.message}

                            time={msg.time}

                        />

                    ))
                }



                {
                    typing && <TypingIndicator />
                }


            </div>



            {/* Input */}

            <ChatInput
                onSend={handleSend}
            />


        </div>

    );

}


export default AIChat;