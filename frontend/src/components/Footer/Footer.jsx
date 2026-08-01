function Footer() {
    const socialLinks = [
        {
            label: "GitHub",
            href: "https://github.com/Sonaltalukdar",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.292-1.552 3.296-1.23 3.296-1.23.647 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .315.216.69.825.572C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
            ),
        },

        {
            label: "Portfolio",
            href: "https://sonaltalukdar.netlify.app/",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                    <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>
            ),
        },

        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/sonal-talukdar-b0b998391/",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V8.999h3.564v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },

        {
            label: "Email",
            href: "mailto:sonaltalukdar29@gmail.com",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                    />
                    <polyline points="3,7 12,13 21,7" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="relative w-full bg-black/40 backdrop-blur-xl border-t border-white/10 overflow-hidden">

            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[2px] bg-cyan-400 blur-xl opacity-70" />

            <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-12">

                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                    {/* Logo & Description */}
                    <div className="flex flex-col items-start">

                        {/* Logo */}
                        <div className="flex items-center h-12 mb-4 -ml-6">
                            <img
                                src="/logo.png"
                                alt="AtmosAI Logo"
                                className="h-12 w-[170px] object-contain"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Real-time weather, air quality, and AI-powered forecasts — all in one place, wherever you are.
                        </p>
                    </div>

                    {/* Connect */}
                    <div className="md:pt-1">
                        <h3 className="text-white font-semibold text-lg mb-5">
                            Connect
                        </h3>

                        <div className="flex items-center gap-6">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    title={item.label}
                                    className="text-gray-300 hover:text-cyan-400 transition"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-sm text-gray-500">

                    <p>
                        © {new Date().getFullYear()} AtmosAI. All rights reserved.
                    </p>

                    <p>
                        Developed by{" "}
                        <span className="text-gray-400">
                            Sonal
                        </span>
                    </p>

                </div>

            </div>
        </footer>
    );
}

export default Footer;