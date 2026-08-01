function TypingIndicator() {

    return (

        <div
            className="
            flex
            items-end
            gap-4
            animate-[fadeIn_.35s_ease-out]
            "
        >

            {/* AI Avatar */}

            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">

                <img
                    src="/ai_logo.png"
                    alt="AtmosAI"
                    className="h-10 w-10 object-contain"
                />

            </div>

            {/* Typing Bubble */}

            <div
                className="
                flex
                flex-col
                gap-1.5
                rounded-[22px]
                rounded-bl-md
                border
                border-white/10
                bg-white/[0.07]
                backdrop-blur-xl
                px-4
                py-3
                shadow-xl
                shadow-black/20
                "
            >

                {/* Text */}

                <span
                    className="
                    text-[11px]
                    text-gray-400
                    tracking-wide
                    "
                >
                    AtmosAI is thinking...
                </span>

                {/* Animated Dots */}

                <div
                    className="
                    flex
                    items-center
                    gap-1.5
                    "
                >

                    <span
                        className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-sky-400
                        animate-bounce
                        "
                    />

                    <span
                        className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-cyan-400
                        animate-bounce
                        [animation-delay:150ms]
                        "
                    />

                    <span
                        className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-blue-400
                        animate-bounce
                        [animation-delay:300ms]
                        "
                    />

                </div>

            </div>

        </div>

    );

}


export default TypingIndicator;