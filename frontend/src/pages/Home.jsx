import WeatherCard from "../components/Home/WeatherCard.jsx";
import HourlyForecast from "../components/Home/HourlyForecast.jsx";
import WeeklyForecast from "../components/Home/WeeklyForecast.jsx";
import AirQuality from "../components/Home/AirQuality.jsx";
import { useEffect, useState } from "react";
import { useWeatherCondition } from "../Context/WeatherContext.jsx";
import {
  getWeatherByCoords,
  getForecastByCoords,
  getWeatherByCity,
  getForecastByCity,
} from "../services/weatherApi.js";
import { getCurrentLocation } from "../services/geolocation.js";

function Home() {
  const { weatherData, setWeatherData, setForecastData } =
    useWeatherCondition();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentWeather = async () => {
      try {
        // Try user's current location
        const { lat, lon } = await getCurrentLocation();

        const weather = await getWeatherByCoords(lat, lon);
        setWeatherData(weather);

        const forecast = await getForecastByCoords(lat, lon);
        setForecastData(forecast);
      } catch (error) {
        console.error(
          "Location unavailable. Loading default city...",
          error
        );

        try {
          // Fallback city
          const weather = await getWeatherByCity("Kolkata");
          setWeatherData(weather);

          const forecast = await getForecastByCity("Kolkata");
          setForecastData(forecast);
        } catch (err) {
          console.error("Fallback weather failed:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCurrentWeather();
  }, [setWeatherData, setForecastData]);

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          w-full
          flex
          items-center
          justify-center
          relative
          overflow-hidden
          px-6
        "
      >
        <div className="glow-blob glow-blob-blue w-[420px] h-[420px] top-1/4 -left-20"></div>
        <div className="glow-blob glow-blob-purple w-[380px] h-[380px] bottom-0 -right-10"></div>
        <div className="glow-blob glow-blob-green w-64 h-64 top-10 right-1/3 opacity-30"></div>

        <div className="relative flex flex-col items-center gap-7">
          <img
            src="/logo.png"
            alt="AtmosAI Logo"
            className="h-12 w-auto object-contain"
          />

          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-400 border-r-purple-400 animate-spin"></div>

            <div className="icon-badge w-16 h-16">
              <span className="icon-float text-3xl">🌤️</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="gradient-text-blue text-xl font-semibold">
              Getting your weather ready
            </p>

            <p className="text-gray-400 text-sm">
              Detecting your location...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load weather data.
      </div>
    );
  }

  return (
    <div
      className="pb-20"
      style={{
        paddingTop: "calc(var(--navbar-height) + 16px)",
        paddingLeft: "56px",
        paddingRight: "56px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 items-stretch">
        <div className="h-[420px]">
          <WeatherCard />
        </div>

        <div className="h-[420px]">
          <HourlyForecast />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-[420px] min-w-0">
          <WeeklyForecast />
        </div>

        <div className="h-[420px] min-w-[320px]">
          <AirQuality />
        </div>
      </div>
    </div>
  );
}

export default Home;