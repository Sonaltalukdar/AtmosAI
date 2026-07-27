import { NavLink } from "react-router-dom";

function Navbar() {
    const navLinkClass = ({ isActive }) =>
        `nav-link cursor-pointer transition-colors ${
            isActive ? "text-sky-400" : "text-white hover:text-sky-400"
        }`;

    return (
        <header className="fixed top-0 left-0 w-full z-50 ">

            <div className="navbar-accent"></div>

            <nav
                className="
                w-full
                h-[72px]
                pl-12
                pr-40
                flex
                items-center
                justify-between
                bg-white/[0.04]
                backdrop-blur-xl
                border-b
                border-white/10
                shadow-lg
                shadow-black/20
                "
            >

                {/* Left Section */}
                <div className="flex items-center">

                    {/* Logo */}
                    <img
                        src="/logo.png"
                        alt="AtmosAI Logo"
                        className="logo-glow h-16 w-[220px] object-contain flex-shrink-0 cursor-pointer"
                    />

                    {/* Navigation */}
                    <ul className="hidden lg:flex items-center gap-12 pl-32 text-[17px] font-medium">

                        <li>
                            <NavLink to="/" end className={navLinkClass}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/favorites" className={navLinkClass}>
                                Favorites
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/about" className={navLinkClass}>
                                About
                            </NavLink>
                        </li>

                    </ul>

                </div>

                {/* Right Section */}
                <div className="flex items-center gap-5 ml-auto">

                    {/* Login */}
                    <button
                        className="btn-lift shine flex items-center justify-center h-[46px] px-10 min-w-[110px] rounded-full bg-gray-200 text-black text-[15px] font-bold whitespace-nowrap hover:bg-gray-300 cursor-pointer"
                    >
                        Log In
                    </button>

                    {/* Sign Up */}
                    <button
                        className="btn-lift signup-glow shine flex items-center justify-center h-[46px] px-10 min-w-[110px] rounded-full text-white text-[15px] font-bold whitespace-nowrap cursor-pointer"
                    >
                        Sign Up
                    </button>

                </div>

            </nav>

        </header>
    );
}

export default Navbar;