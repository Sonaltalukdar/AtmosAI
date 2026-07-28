// App.jsx

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AuthModal from "./components/Auth/AuthModal.jsx";

import Home from "./pages/Home.jsx";

import WeatherBackground from "./components/Weather/WeatherBackground.jsx";

import {
    WeatherProvider,
    useWeatherCondition
} from "./Context/WeatherContext.jsx";


// Weather context access korar jonno inner component
function AppShell() {

    const { weatherData } = useWeatherCondition();

    const [showModal, setShowModal] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const openAuthModal = (loginMode) => {
        setIsLoginMode(loginMode);
        setShowModal(true);
    };

    return (

        <WeatherBackground condition={weatherData?.condition}>

            <Navbar onOpenAuth={openAuthModal} />


            <main>

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                </Routes>

            </main>


            <Footer />


            <AuthModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                startInLogin={isLoginMode}
            />


        </WeatherBackground>

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