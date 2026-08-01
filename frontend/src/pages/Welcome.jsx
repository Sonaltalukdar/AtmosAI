import { useState, useMemo, useEffect } from "react";
import AuthModal from "../components/Auth/AuthModal.jsx";

// Pre-computed once per mount so stars/shooting-stars don't reshuffle on every re-render
function useStars(count) {
    return useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                left: `${(i * 5.3 + (i % 7) * 2) % 100}%`,
                top: `${(i * 8.7 + (i % 5) * 6) % 90}%`,
                size: 1 + (i % 3),
                dur: 2 + (i % 5) * 0.8,
                delay: -(i % 10) * 0.6,
            })),
        [count]
    );
}

function useShootingStars(count) {
    return useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                top: `${10 + i * 16}%`,
                left: `${55 + i * 12}%`,
                dur: 7 + i * 2.5,
                delay: -(i * 3.2),
            })),
        [count]
    );
}

// Types out text character by character
function useTypewriter(fullText, speed = 45, startDelay = 500) {
    const [length, setLength] = useState(0);

    useEffect(() => {
        let charTimer;

        const startTimer = setTimeout(() => {
            let i = 0;

            const tick = () => {
                i++;
                setLength(i);

                if (i < fullText.length) {
                    const jitter = Math.random() * 20 - 5;
                    charTimer = setTimeout(tick, speed + jitter);
                }
            };

            tick();
        }, startDelay);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(charTimer);
        };
    }, [fullText, speed, startDelay]);

    return fullText.slice(0, length);
}

// Renders typed-out text
function TypedChars({ text, charClassName = "" }) {
    return text.split("").map((ch, i) =>
        ch === " " ? (
            <span key={i}> </span>
        ) : (
            <span key={i} className={`char-in ${charClassName}`.trim()}>
                {ch}
            </span>
        )
    );
}

function Welcome({ onLoginSuccess }) {

    const [showModal, setShowModal] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const stars = useStars(70);
    const shootingStars = useShootingStars(4);

    const HEADING_LEAD = "Know Your Weather ";
    const HEADING_HIGHLIGHT = "Instantly";

    // Faster typing
    const typed = useTypewriter(
        HEADING_LEAD + HEADING_HIGHLIGHT,
        45,
        500
    );

    const typedLead = typed.slice(0, HEADING_LEAD.length);
    const typedHighlight = typed.slice(HEADING_LEAD.length);

    const typingDone =
        typed.length >=
        (HEADING_LEAD + HEADING_HIGHLIGHT).length;

    const openAuthModal = (loginMode) => {
        setIsLoginMode(loginMode);
        setShowModal(true);
    };

    return (
        <div
            className="
                galaxy-bg
                relative
                min-h-screen
                w-full
                flex
                flex-col
                items-center
                justify-center
                gap-6
                sm:gap-8
                text-white
                px-4
                sm:px-6
                py-10
                sm:py-6
                overflow-hidden
            "
        >

            {/* Moon */}
            <div
                className="
                    galaxy-moon-wrap
                    absolute
                    top-[7%]
                    right-[5%]
                    sm:top-[8%]
                    sm:right-[11%]
                    w-[75px]
                    h-[75px]
                    sm:w-[130px]
                    sm:h-[130px]
                "
            >
                <div className="galaxy-moon"></div>
            </div>

            {/* Twinkling background stars */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((s, i) => (
                    <div
                        key={i}
                        className="galaxy-star"
                        style={{
                            left: s.left,
                            top: s.top,
                            width: s.size,
                            height: s.size,
                            animationDuration: `${s.dur}s`,
                            animationDelay: `${s.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Shooting stars */}
            <div className="absolute inset-0 pointer-events-none">
                {shootingStars.map((sh, i) => (
                    <div
                        key={i}
                        className="galaxy-shooting-star"
                        style={{
                            top: sh.top,
                            left: sh.left,
                            animationDuration: `${sh.dur}s`,
                            animationDelay: `${sh.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Logo */}
            <img
                src="/logo.png"
                alt="AtmosAI Logo"
                className="
                    relative
                    logo-glow
                    logo-float
                    h-14
                    sm:h-16
                    md:h-20
                    w-auto
                    max-w-[75vw]
                    object-contain
                    shrink-0
                "
            />

            {/* Tagline */}
            <div
                className="
                    relative
                    text-center
                    w-full
                    max-w-md
                    px-1
                    sm:px-0
                "
            >
                <h1
                    className="
                        animate-fade-in-up
                        delay-1
                        text-[26px]
                        leading-tight
                        sm:text-3xl
                        md:text-4xl
                        font-bold
                        mb-3
                    "
                >
                    <TypedChars text={typedLead} />

                    <span className="no-break-word">
                        <TypedChars
                            text={typedHighlight}
                            charClassName="gradient-text-blue heading-shimmer"
                        />
                    </span>

                    <span
                        className="typing-caret"
                        style={{
                            height: "1em",
                            opacity: typingDone ? undefined : 1,
                        }}
                    >
                        &nbsp;
                    </span>
                </h1>

                <p
                    className="
                        animate-fade-in-up
                        delay-2
                        text-white/60
                        text-sm
                        sm:text-base
                        leading-relaxed
                        px-2
                        sm:px-0
                    "
                >
                    AI-powered forecasts, real-time conditions, and smart
                    insights all in one place.
                </p>
            </div>

            {/* Buttons */}
            <div
                className="
                    animate-fade-in-up
                    delay-3
                    relative
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    gap-3
                    sm:gap-4
                    mt-2
                    sm:mt-4
                    w-full
                    sm:w-auto
                    px-4
                    sm:px-0
                "
            >

                {/* Log In */}
                <button
                    onClick={() => openAuthModal(true)}
                    className="
                        btn-lift
                        shine
                        h-[46px]
                        w-full
                        max-w-[240px]
                        sm:w-auto
                        sm:max-w-none
                        px-10
                        min-w-[130px]
                        rounded-full
                        bg-gray-200
                        text-black
                        text-[15px]
                        font-bold
                        hover:bg-gray-300
                        cursor-pointer
                    "
                >
                    Log In
                </button>

                {/* Sign Up */}
                <button
                    onClick={() => openAuthModal(false)}
                    className="
                        btn-lift
                        signup-glow
                        shine
                        h-[46px]
                        w-full
                        max-w-[240px]
                        sm:w-auto
                        sm:max-w-none
                        px-10
                        min-w-[130px]
                        rounded-full
                        text-white
                        text-[15px]
                        font-bold
                        cursor-pointer
                    "
                >
                    Sign Up
                </button>

            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                startInLogin={isLoginMode}
                onLoginSuccess={onLoginSuccess}
            />

        </div>
    );
}

export default Welcome;