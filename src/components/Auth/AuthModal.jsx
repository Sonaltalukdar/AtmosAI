import { useState, useEffect } from "react";
import { X } from "lucide-react";

function AuthModal({ isOpen, onClose, startInLogin }) {
    const [isLogin, setIsLogin] = useState(startInLogin);

    useEffect(() => {
        setIsLogin(startInLogin);
    }, [startInLogin, isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/60 backdrop-blur-sm
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                relative
                w-[380px]
                rounded-3xl
                p-8
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                shadow-2xl
                text-white
                "
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
                >
                    <X size={22} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? "Log In" : "Sign Up"}
                </h2>

                {/* Form */}
                <form className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="
                        h-[46px] px-4 rounded-full
                        bg-white/10 border border-white/20
                        text-white placeholder-white/50
                        outline-none focus:border-white/50
                        "
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="
                        h-[46px] px-4 rounded-full
                        bg-white/10 border border-white/20
                        text-white placeholder-white/50
                        outline-none focus:border-white/50
                        "
                    />

                    <button
                        type="submit"
                        className="
                        btn-lift shine
                        h-[46px] rounded-full
                        bg-gray-200 text-black
                        font-bold cursor-pointer
                        mt-2
                        "
                    >
                        {isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>

                {/* Toggle */}
                <p className="text-center text-white/70 text-sm mt-5">
                    {isLogin ? "New user? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white font-semibold cursor-pointer hover:underline"
                    >
                        {isLogin ? "Sign Up here" : "Log In here"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AuthModal;