import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AuthModal from "./components/Auth/AuthModal.jsx";

import Welcome from "./pages/Welcome.jsx";
import Home from "./pages/Home.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import WeatherMap from "./pages/WeatherMap.jsx";
import Favourites from "./pages/Favourites.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/Profile.jsx";

import WeatherBackground from "./components/Weather/WeatherBackground.jsx";

import {
    WeatherProvider,
    useWeatherCondition
} from "./Context/WeatherContext.jsx";


function AppShell() {

    const { weatherData } = useWeatherCondition();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const openAuthModal = (loginMode) => {
        setIsLoginMode(loginMode);
        setShowModal(true);
    };

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        navigate("/home");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/");
    };

    return (
        <>
            <Routes>

                <Route
                    path="/"
                    element={
                        currentUser ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <Welcome onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />

                <Route
                    path="/home"
                    element={
                        <WeatherBackground condition={weatherData?.condition}>
                            {weatherData && (
                                <Navbar
                                    onOpenAuth={openAuthModal}
                                    currentUser={currentUser}
                                    onLogout={handleLogout}
                                />
                            )}

                            <main>
                                <Home />
                            </main>

                            {weatherData && <Footer />}
                        </WeatherBackground>
                    }
                />

                <Route
                    path="/ai-assistant"
                    element={
                        <>
                            <Navbar
                                onOpenAuth={openAuthModal}
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />

                            <main>
                                <AIAssistant currentUser={currentUser} />
                            </main>
                        </>
                    }
                />

                <Route
                    path="/weather-map"
                    element={
                        <>
                            <Navbar
                                onOpenAuth={openAuthModal}
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />

                            <main>
                                <WeatherMap />
                            </main>

                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/favourites"
                    element={
                        <>
                            <Navbar
                                onOpenAuth={openAuthModal}
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />

                            <main>
                                <Favourites />
                            </main>

                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/contact"
                    element={
                        <>
                            <Navbar
                                onOpenAuth={openAuthModal}
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />

                            <main>
                                <Contact />
                            </main>

                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <Profile
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                        />
                    }
                />

            </Routes>


            <AuthModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                startInLogin={isLoginMode}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}


function App() {

    return (

        <WeatherProvider>

            <AppShell />

        </WeatherProvider>

    );

}


export default App;