import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";

function AuthModal({ isOpen, onClose, startInLogin, onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(startInLogin);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsLogin(startInLogin);
        setError("");
    }, [startInLogin, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            let response;

            if (isLogin) {
                response = await axios.post(
                    "https://atmosai-backend.onrender.com/api/auth/login",
                    {
                        email,
                        password,
                    }
                );
            } else {
                response = await axios.post(
                    "https://atmosai-backend.onrender.com/api/auth/signup",
                    {
                        name,
                        email,
                        password,
                    }
                );
            }

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            onLoginSuccess(user);
            onClose();
        } catch (err) {
            console.error("Auth Error:", err);
            console.error("Status:", err.response?.status);
            console.error("Response:", err.response?.data);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }
    return (
        <div
            className="
                fixed inset-0 z-[100]
                flex items-center justify-center
                px-4
                py-6
                overflow-y-auto
                bg-black/60
                backdrop-blur-sm
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    relative
                    w-full
                    max-w-[380px]
                    max-h-[calc(100vh-48px)]
                    overflow-y-auto
                    rounded-3xl
                    p-6
                    sm:p-8
                    bg-white/10
                    backdrop-blur-xl
                    border border-white/20
                    shadow-2xl
                    text-white
                "
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="
                        absolute
                        top-4
                        right-4
                        text-white/70
                        hover:text-white
                        transition-colors
                        cursor-pointer
                    "
                >
                    <X size={22} />
                </button>

                {/* Heading */}
                <h2
                    className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        mb-5
                        sm:mb-6
                        text-center
                    "
                >
                    {isLogin ? "Log In" : "Sign Up"}
                </h2>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3.5 sm:gap-4"
                >
                    {/* Name */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="
                                w-full
                                h-[46px]
                                px-4
                                rounded-full
                                bg-white/10
                                border border-white/20
                                text-white
                                text-sm
                                outline-none
                                placeholder:text-white/40
                                focus:border-white/40
                                transition-colors
                            "
                        />
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
                            w-full
                            h-[46px]
                            px-4
                            rounded-full
                            bg-white/10
                            border border-white/20
                            text-white
                            text-sm
                            outline-none
                            placeholder:text-white/40
                            focus:border-white/40
                            transition-colors
                        "
                    />

                    {/* Password */}
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full
                                h-[46px]
                                pl-4
                                pr-11
                                rounded-full
                                bg-white/10
                                border border-white/20
                                text-white
                                text-sm
                                outline-none
                                placeholder:text-white/40
                                focus:border-white/40
                                transition-colors
                            "
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-white/50
                                hover:text-white/80
                                transition-colors
                                cursor-pointer
                            "
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p
                            className="
                                text-red-400
                                text-xs
                                sm:text-sm
                                text-center
                                break-words
                            "
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            h-[46px]
                            rounded-full
                            bg-gray-200
                            text-black
                            font-bold
                            text-sm
                            mt-1
                            sm:mt-2
                            transition-all
                            hover:bg-gray-300
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            cursor-pointer
                        "
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Log In"
                                : "Sign Up"}
                    </button>
                </form>

                {/* Switch Login / Signup */}
                <p
                    className="
                        text-center
                        text-white/70
                        text-xs
                        sm:text-sm
                        mt-4
                        sm:mt-5
                    "
                >
                    {isLogin
                        ? "New user? "
                        : "Already have an account? "}

                    <span
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        className="
                            text-white
                            font-semibold
                            cursor-pointer
                            hover:underline
                        "
                    >
                        {isLogin
                            ? "Sign Up here"
                            : "Log In here"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AuthModal;