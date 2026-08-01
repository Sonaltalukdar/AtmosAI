import { useRef, useState, useEffect } from "react";
import {
    Paperclip,
    Send,
    X,
    FileText,
    Image as ImageIcon,
} from "lucide-react";

function ChatInput({ onSend }) {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const imageInputRef = useRef(null);
    const docInputRef = useRef(null);
    const menuRef = useRef(null);

    // Menu-r baire click korle menu bondho hoye jabe
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handlePaperclipClick = () => {
        setShowMenu((prev) => !prev);
    };

    const handlePickImage = () => {
        setShowMenu(false);
        imageInputRef.current?.click();
    };

    const handlePickDocument = () => {
        setShowMenu(false);
        docInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (selected) {
            setFile(selected);
        }

        e.target.value = "";
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleSend = () => {
        if (!text.trim() && !file) return;

        onSend(text, file);

        setText("");
        setFile(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const isImage =
        file && file.type.startsWith("image/");

    return (
        <div className="pt-2 sm:pt-3">

            {/* ================================================= */}
            {/* ATTACHED FILE PREVIEW */}
            {/* ================================================= */}

            {file && (
                <div
                    className="
                        mb-2
                        flex
                        items-center
                        gap-2
                        w-fit
                        max-w-full
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.06]
                        px-3
                        py-1.5
                        text-xs
                        text-gray-300
                    "
                >
                    {isImage ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="
                                h-5
                                w-5
                                rounded
                                object-cover
                                shrink-0
                            "
                        />
                    ) : (
                        <FileText
                            size={14}
                            className="
                                text-sky-400
                                shrink-0
                            "
                        />
                    )}

                    <span
                        className="
                            max-w-[150px]
                            sm:max-w-[160px]
                            truncate
                        "
                    >
                        {file.name}
                    </span>

                    <button
                        onClick={removeFile}
                        className="
                            text-gray-400
                            hover:text-red-400
                            transition-colors
                            shrink-0
                        "
                    >
                        <X size={13} />
                    </button>
                </div>
            )}


            {/* ================================================= */}
            {/* INPUT CONTAINER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    flex
                    items-center
                    gap-2
                    sm:gap-3
                    rounded-[20px]
                    sm:rounded-[22px]
                    border
                    border-white/10
                    bg-white/[0.06]
                    px-3
                    sm:px-4
                    py-2
                    sm:py-2.5
                    transition-all
                    duration-300
                    focus-within:border-sky-400/50
                    focus-within:bg-white/[0.08]
                    focus-within:shadow-[0_0_30px_rgba(14,165,233,.15)]
                "
            >

                {/* Hidden image input */}
                <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* Hidden document input */}
                <input
                    type="file"
                    ref={docInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.txt"
                    className="hidden"
                />


                {/* ================================================= */}
                {/* PAPERCLIP */}
                {/* ================================================= */}

                <div
                    className="relative shrink-0"
                    ref={menuRef}
                >
                    <button
                        onClick={handlePaperclipClick}
                        className="
                            flex
                            items-center
                            justify-center
                            p-1
                            text-gray-400
                            transition-all
                            duration-300
                            hover:text-sky-400
                            hover:scale-110
                            cursor-pointer
                        "
                    >
                        <Paperclip
                            size={18}
                        />
                    </button>


                    {/* Attachment Menu */}
                    {showMenu && (
                        <div
                            className="
                                absolute
                                bottom-full
                                left-0
                                mb-3
                                w-40
                                sm:w-44
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#0f121c]
                                shadow-xl
                                shadow-black/40
                                overflow-hidden
                                z-50
                            "
                        >

                            {/* Photo */}
                            <button
                                onClick={handlePickImage}
                                className="
                                    w-full
                                    flex
                                    items-center
                                    gap-2.5
                                    px-4
                                    py-3
                                    text-sm
                                    text-gray-200
                                    hover:bg-white/[0.06]
                                    transition-colors
                                    cursor-pointer
                                "
                            >
                                <ImageIcon
                                    size={16}
                                    className="text-sky-400"
                                />

                                Photo
                            </button>


                            {/* Document */}
                            <button
                                onClick={handlePickDocument}
                                className="
                                    w-full
                                    flex
                                    items-center
                                    gap-2.5
                                    px-4
                                    py-3
                                    text-sm
                                    text-gray-200
                                    hover:bg-white/[0.06]
                                    transition-colors
                                    border-t
                                    border-white/5
                                    cursor-pointer
                                "
                            >
                                <FileText
                                    size={16}
                                    className="text-sky-400"
                                />

                                Document
                            </button>

                        </div>
                    )}
                </div>


                {/* ================================================= */}
                {/* TEXT INPUT */}
                {/* ================================================= */}

                <input
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Ask AtmosAI anything"
                    className="
                        min-w-0
                        flex-1
                        bg-transparent
                        outline-none
                        text-[13px]
                        sm:text-sm
                        text-white
                        placeholder:text-gray-500
                    "
                />


                {/* ================================================= */}
                {/* SEND BUTTON */}
                {/* ================================================= */}

                <button
                    onClick={handleSend}
                    className="
                        group
                        flex
                        h-9
                        w-9
                        sm:h-11
                        sm:w-11
                        items-center
                        justify-center
                        rounded-xl
                        sm:rounded-2xl
                        bg-gradient-to-br
                        from-sky-500
                        via-cyan-500
                        to-blue-600
                        text-white
                        shadow-lg
                        shadow-sky-500/30
                        transition-all
                        duration-300
                        hover:scale-110
                        hover:shadow-[0_0_30px_rgba(14,165,233,.5)]
                        active:scale-95
                        shrink-0
                        cursor-pointer
                    "
                >
                    <Send
                        size={15}
                        className="
                            sm:w-[17px]
                            sm:h-[17px]
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5
                        "
                    />
                </button>

            </div>


            {/* ================================================= */}
            {/* BOTTOM TEXT */}
            {/* ================================================= */}

            <p
                className="
                    mt-2
                    px-2
                    text-center
                    text-[9px]
                    sm:text-[10px]
                    leading-4
                    tracking-wide
                    text-gray-500
                "
            >
                AtmosAI may provide inaccurate information.
                Verify critical weather updates.
            </p>

        </div>
    );
}

export default ChatInput;