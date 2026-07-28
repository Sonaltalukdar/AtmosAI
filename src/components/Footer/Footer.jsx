function Footer() {
    return (
        <footer className="
            relative
            w-full
            mt-20
            bg-black/40
            backdrop-blur-xl
            border-t
            border-white/10
            overflow-hidden
        ">

            {/* Neon Glow */}
            <div className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-[400px]
                h-[2px]
                bg-cyan-400
                blur-xl
                opacity-70
            "></div>


            <div className="
                max-w-[1600px]
                mx-auto
                px-12
                py-12
            ">

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-10
                    items-center
                ">


                    {/* Brand */}
                    <div>

                        <div className="flex items-center mb-4">

                            <img
                                src="/logo.png"
                                alt="AtmosAI Logo"
                                className="
                                    h-12
                                    w-[170px]
                                    object-contain
                                "
                            />

                        </div>


                        <p className="
                            text-gray-400
                            text-sm
                            leading-relaxed
                            max-w-sm
                        ">
                            AI-powered intelligent weather experience
                            with futuristic visuals, real-time data and
                            smart climate insights.
                        </p>

                    </div>

                    {/* Social */}
                    <div>

                        <h3 className="
                            text-white
                            font-semibold
                            text-lg
                            mb-4
                        ">
                            Connect
                        </h3>


                        <div className="flex gap-4">


                            <button className="
                                h-10
                                w-10
                                rounded-full
                                border
                                border-white/20
                                text-gray-300
                                hover:text-cyan-400
                                hover:border-cyan-400
                                transition
                            ">
                                GH
                            </button>


                            <button className="
                                h-10
                                w-10
                                rounded-full
                                border
                                border-white/20
                                text-gray-300
                                hover:text-cyan-400
                                hover:border-cyan-400
                                transition
                            ">
                                IN
                            </button>


                            <button className="
                                h-10
                                w-10
                                rounded-full
                                border
                                border-white/20
                                text-gray-300
                                hover:text-cyan-400
                                hover:border-cyan-400
                                transition
                            ">
                                X
                            </button>


                        </div>

                    </div>


                </div>



                {/* Bottom */}
                <div className="
                    mt-10
                    pt-6
                    border-t
                    border-white/10
                    flex
                    flex-col
                    md:flex-row
                    justify-between
                    gap-3
                    text-sm
                    text-gray-500
                ">

                    <p>
                        © {new Date().getFullYear()} AtmosAI. All rights reserved.
                    </p>


                    <p>
                        Developed by Sonal
                    </p>

                </div>


            </div>

        </footer>
    );
}

export default Footer;