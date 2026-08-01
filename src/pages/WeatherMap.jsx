import { useState } from "react";
import "leaflet/dist/leaflet.css";

import MapContainer from "../components/WeatherMap/MapContainer.jsx";
import LayerToggle from "../components/WeatherMap/LayerToggle.jsx";
import MapSearchBar from "../components/WeatherMap/MapSearchBar.jsx";
import LocationInfoCard from "../components/WeatherMap/LocationInfoCard.jsx";
import MapLegend from "../components/WeatherMap/MapLegend.jsx";

import { getWeatherAtPoint } from "../services/weatherMapApi.js";
import { getCurrentLocation } from "../services/geolocation.js";

function WeatherMap() {
    const [activeLayer, setActiveLayer] = useState("temp");
    const [flyToPosition, setFlyToPosition] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(false);

    const fetchWeatherForPoint = async (lat, lon) => {
        setLoadingWeather(true);
        setWeatherData(null);

        try {
            const data = await getWeatherAtPoint(lat, lon);
            setWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather at point:", error);
        } finally {
            setLoadingWeather(false);
        }
    };

    const handleMapClick = (lat, lon) => {
        setMarkerPosition({ lat, lon });
        fetchWeatherForPoint(lat, lon);
    };

    const handleLocationSelect = ({ lat, lon, name }) => {
        setFlyToPosition({ lat, lon });
        setMarkerPosition({ lat, lon });
        fetchWeatherForPoint(lat, lon);
    };

    const handleUseCurrentLocation = async () => {
        try {
            const { lat, lon } = await getCurrentLocation();

            setFlyToPosition({ lat, lon });
            setMarkerPosition({ lat, lon });

            fetchWeatherForPoint(lat, lon);
        } catch (error) {
            console.error(
                "Could not get current location:",
                error
            );
        }
    };

    return (
        <div
            className="relative w-full"
            style={{
                height: "calc(100vh - var(--navbar-height))",
                zIndex: 0,
            }}
        >

            {/* ================= MAP ================= */}

            <MapContainer
                activeLayer={activeLayer}
                flyToPosition={flyToPosition}
                markerPosition={markerPosition}
                onMapClick={handleMapClick}
            />


            {/* ================================================= */}
            {/* SEARCH BAR */}
            {/* ================================================= */}

            <div
                className="
                    absolute
                    top-3
                    left-3
                    right-3
                    z-[1000]
                    flex
                    justify-center
                "
            >
                <div className="w-full max-w-[520px]">
                    <MapSearchBar
                        onLocationSelect={handleLocationSelect}
                        onUseCurrentLocation={
                            handleUseCurrentLocation
                        }
                    />
                </div>
            </div>


            {/* ================================================= */}
            {/* WEATHER LAYERS */}
            {/* ================================================= */}

            <div
                className="
                    absolute
                    top-[80px]
                    left-3
                    right-3
                    z-[1000]
                    flex
                    justify-center
                "
            >
                <LayerToggle
                    activeLayer={activeLayer}
                    onChange={setActiveLayer}
                />
            </div>


            {/* ================= LOCATION INFO ================= */}

            <LocationInfoCard
                data={weatherData}
                loading={loadingWeather}
                onClose={() => {
                    setWeatherData(null);
                    setMarkerPosition(null);
                }}
            />


            {/* ================= MAP LEGEND ================= */}

            <MapLegend
                activeLayer={activeLayer}
            />

        </div>
    );
}

export default WeatherMap;