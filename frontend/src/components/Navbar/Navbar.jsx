import { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import Searchbar from "./Searchbar.jsx";

const navLinks = [
    { label: "Home", to: "/home" },
    { label: "AI Assistant", to: "/ai-assistant" },
    { label: "Weather Map", to: "/weather-map" },
    { label: "Favourites", to: "/favourites" },
    { label: "Contact Us", to: "/contact" },
];

function Navbar({ onOpenAuth, currentUser, onLogout }) {

    const navigate = useNavigate();
    const location = useLocation();

    const showSearchbar = location.pathname === "/home";

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileNavOpen(false);
    }, [location.pathname]);

    return (
        <header
            className="
                sticky
                top-0
                w-full
                z-50
                bg-black/40
                backdrop-blur-xl
                border-b
                border-white/10
            "
        >

            <div className="navbar-accent"></div>

            <nav
                className="
                    w-full
                    h-[64px]
                    md:h-[72px]
                    px-4
                    sm:px-6
                    md:px-12
                    flex
                    items-center
                    justify-between
                "
            >

                {/* Left group: Logo + Nav Links */}
                <div className="flex items-center gap-6 md:gap-12">

                    {/* Logo */}
                    <div className="flex items-center">

                        <img
                            src="/logo.png"
                            alt="AtmosAI Logo"
                            onClick={() => navigate("/home")}
                            className="
                                logo-glow
                                h-9
                                w-[130px]
                                md:h-12
                                md:w-[170px]
                                object-contain
                                cursor-pointer
                                mt-1
                                md:mt-1.5
                            "
                        />

                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">

                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `text-[15px] font-medium transition-colors ${
                                        isActive
                                            ? "text-sky-400"
                                            : "text-gray-300 hover:text-white"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                    </div>

                </div>


                {/* ================================================= */}
                {/* RIGHT SECTION */}
                {/* ================================================= */}

                <div className="flex items-center gap-2 sm:gap-3 md:gap-5">

                    {/* Searchbar
                        Mobile + Desktop */}
                    {showSearchbar && (
                        <div
                            className="
                                flex-1
                                min-w-0
                                sm:flex-none
                                sm:w-auto
                            "
                        >
                            <Searchbar />
                        </div>
                    )}


                    {/* Logged in */}
                    {currentUser ? (

                        <div
                            className="relative"
                            ref={menuRef}
                        >

                            {/* Avatar */}
                            <button
                                onClick={() =>
                                    setMenuOpen((prev) => !prev)
                                }
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    w-9
                                    h-9
                                    md:w-11
                                    md:h-11
                                    rounded-full
                                    bg-blue-500
                                    text-white
                                    font-bold
                                    text-sm
                                    hover:opacity-90
                                    cursor-pointer
                                    transition-all
                                    overflow-hidden
                                    shrink-0
                                "
                            >

                                {currentUser.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    currentUser.name
                                        ?.charAt(0)
                                        .toUpperCase()
                                )}

                            </button>


                            {/* Profile Dropdown */}
                            {menuOpen && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-[50px]
                                        md:top-[54px]
                                        w-[140px]
                                        sm:w-[180px]
                                        rounded-xl
                                        sm:rounded-2xl
                                        bg-[#0A0F1D]
                                        border
                                        border-slate-700
                                        shadow-[0_25px_60px_rgba(0,0,0,0.75)]
                                        overflow-hidden
                                        z-[999]
                                    "
                                >

                                    {/* Profile */}
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-2
                                            sm:gap-3
                                            px-3
                                            sm:px-5
                                            py-2.5
                                            sm:py-3
                                            text-left
                                            text-gray-200
                                            text-[13px]
                                            sm:text-[15px]
                                            hover:bg-sky-500/10
                                            hover:text-sky-400
                                            transition-all
                                        "
                                    >
                                        <User size={15} />
                                        Profile
                                    </button>


                                    {/* Logout */}
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onLogout();
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-2
                                            sm:gap-3
                                            px-3
                                            sm:px-5
                                            py-2.5
                                            sm:py-3
                                            text-left
                                            text-gray-200
                                            text-[13px]
                                            sm:text-[15px]
                                            hover:bg-red-500/10
                                            hover:text-red-400
                                            transition-all
                                        "
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>

                    ) : (

                        <>

                            {/* Login */}
                            <button
                                onClick={() => onOpenAuth(true)}
                                className="
                                    btn-lift
                                    shine
                                    flex
                                    items-center
                                    justify-center
                                    h-9
                                    px-4
                                    text-[13px]
                                    sm:h-10
                                    sm:px-6
                                    sm:text-sm
                                    md:h-[46px]
                                    md:px-10
                                    md:min-w-[110px]
                                    md:text-[15px]
                                    rounded-full
                                    bg-gray-200
                                    text-black
                                    font-bold
                                    hover:bg-gray-300
                                    cursor-pointer
                                    whitespace-nowrap
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
                                    h-9
                                    px-4
                                    text-[13px]
                                    sm:h-10
                                    sm:px-6
                                    sm:text-sm
                                    md:h-[46px]
                                    md:px-10
                                    md:min-w-[110px]
                                    md:text-[15px]
                                    rounded-full
                                    text-white
                                    font-bold
                                    cursor-pointer
                                    whitespace-nowrap
                                "
                            >
                                Sign Up
                            </button>

                        </>

                    )}


                    {/* Hamburger / 3 dots — mobile */}
                    <button
                        onClick={() =>
                            setMobileNavOpen((prev) => !prev)
                        }
                        className="
                            md:hidden
                            flex
                            items-center
                            justify-center
                            w-9
                            h-9
                            rounded-full
                            text-gray-200
                            hover:text-sky-400
                            hover:bg-white/5
                            transition-all
                            shrink-0
                        "
                        aria-label="Toggle menu"
                    >
                        {mobileNavOpen ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>

                </div>

            </nav>


            {/* ================================================= */}
            {/* MOBILE RIGHT SIDE MENU */}
            {/* ================================================= */}

            {mobileNavOpen && (
                <>
                    {/* Small overlay */}
                    <div
                        onClick={() => setMobileNavOpen(false)}
                        className="
                            fixed
                            inset-0
                            bg-black/20
                            z-40
                            md:hidden
                        "
                    />

                    {/* Right Side Menu */}
                    <div
                        className="
                            absolute
                            top-[64px]
                            right-0
                            w-[180px]
                            z-50
                            md:hidden

                            bg-black/90
                            backdrop-blur-xl

                            border
                            border-white/10
                            border-r-0

                            rounded-l-xl

                            px-3
                            py-3

                            flex
                            flex-col
                            gap-1

                            shadow-[-15px_10px_40px_rgba(0,0,0,0.45)]

                            animate-slide-in-right
                        "
                    >

                        {/* Navigation Links ONLY */}
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() =>
                                    setMobileNavOpen(false)
                                }
                                className={({ isActive }) =>
                                    `text-[13px] font-medium py-2.5 px-3 rounded-lg transition-colors ${
                                        isActive
                                            ? "text-sky-400 bg-white/5"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                    </div>
                </>
            )}

        </header>
    );
}


/* ================================================= */
/* MOBILE MENU ANIMATION */
/* ================================================= */

const style = document.createElement("style");

style.innerHTML = `
@keyframes slide-in-right {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-slide-in-right {
    animation: slide-in-right 0.25s ease-out;
}
`;

if (!document.head.querySelector("#mobile-menu-animation")) {
    style.id = "mobile-menu-animation";
    document.head.appendChild(style);
}


export default Navbar;