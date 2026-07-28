// import { NavLink } from "react-router-dom";

function Navbar({ onOpenAuth }) {

    return (
        <header className="relative w-full z-50">

            <div className="navbar-accent"></div>

            <nav
                className="
                w-full
                h-[72px]
                px-12
                flex
                items-center
                justify-between
                "
            >

                {/* Logo */}
                <div className="flex items-center">

                    <img
                        src="/logo.png"
                        alt="AtmosAI Logo"
                        className="
                        logo-glow
                        h-16
                        w-[220px]
                        object-contain
                        cursor-pointer
                        mt-4
                        "
                    />

                </div>


                {/* Right Buttons */}
                <div className="flex items-center gap-5">


                    {/* Login */}
                    <button
                        onClick={() => onOpenAuth(true)}
                        className="
                        btn-lift
                        shine
                        flex
                        items-center
                        justify-center
                        h-[46px]
                        px-10
                        min-w-[110px]
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
                        onClick={() => onOpenAuth(false)}
                        className="
                        btn-lift
                        signup-glow
                        shine
                        flex
                        items-center
                        justify-center
                        h-[46px]
                        px-10
                        min-w-[110px]
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

            </nav>

        </header>
    );
}

export default Navbar;