import { useState } from "react";
import {
    User,
    Mail,
    MessageSquare,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch(
                "http://localhost:5000/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to send");
            }

            setStatus("success");

            setForm({
                name: "",
                email: "",
                message: "",
            });
        } catch (error) {
            console.error(
                "Contact form error:",
                error
            );

            setStatus("error");
        }
    };

    return (
        <div
            className="
                w-full
                max-w-md
                mx-auto
                px-4
                sm:px-6
                pt-8
                sm:pt-10
                pb-16
                sm:pb-20
                min-h-[70vh]
                flex
                flex-col
                justify-center
            "
        >

            <form
                onSubmit={handleSubmit}
                className="
                    glass-card
                    card-premium
                    rounded-3xl
                    p-5
                    sm:p-8
                    flex
                    flex-col
                    gap-3
                    sm:gap-4
                    w-full
                "
            >

                {/* ================= NAME ================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-3
                        sm:px-4
                        py-3
                    "
                >
                    <User
                        size={16}
                        className="
                            text-gray-400
                            shrink-0
                        "
                    />

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                        className="
                            min-w-0
                            flex-1
                            bg-transparent
                            outline-none
                            text-sm
                            text-white
                            placeholder:text-gray-500
                        "
                    />
                </div>


                {/* ================= EMAIL ================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-3
                        sm:px-4
                        py-3
                    "
                >
                    <Mail
                        size={16}
                        className="
                            text-gray-400
                            shrink-0
                        "
                    />

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                        className="
                            min-w-0
                            flex-1
                            bg-transparent
                            outline-none
                            text-sm
                            text-white
                            placeholder:text-gray-500
                        "
                    />
                </div>


                {/* ================= MESSAGE ================= */}

                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-3
                        sm:px-4
                        py-3
                    "
                >
                    <MessageSquare
                        size={16}
                        className="
                            text-gray-400
                            shrink-0
                            mt-1
                        "
                    />

                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Message"
                        className="
                            min-w-0
                            flex-1
                            bg-transparent
                            outline-none
                            text-sm
                            text-white
                            placeholder:text-gray-500
                            resize-none
                        "
                    />
                </div>


                {/* ================= SUBMIT ================= */}

                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="
                        btn-lift
                        shine
                        signup-glow
                        flex
                        items-center
                        justify-center
                        w-full
                        h-[46px]
                        sm:h-[48px]
                        rounded-full
                        text-white
                        text-[14px]
                        sm:text-[15px]
                        font-bold
                        cursor-pointer
                        mt-1
                        sm:mt-2
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >
                    {status === "sending"
                        ? "Sending..."
                        : "Send Message"}
                </button>


                {/* ================= SUCCESS ================= */}

                {status === "success" && (
                    <p
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            sm:text-sm
                            text-green-400
                            text-center
                            mt-1
                        "
                    >
                        <CheckCircle
                            size={16}
                            className="shrink-0"
                        />

                        Message sent successfully!
                    </p>
                )}


                {/* ================= ERROR ================= */}

                {status === "error" && (
                    <p
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            sm:text-sm
                            text-red-400
                            text-center
                            mt-1
                        "
                    >
                        <AlertCircle
                            size={16}
                            className="shrink-0"
                        />

                        Something went wrong.
                        Please try again.
                    </p>
                )}

            </form>
        </div>
    );
}

export default Contact;