// WeatherContext.jsx
import { createContext, useContext, useState } from "react";
import { mockLocations } from "../data/Location.js";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  // Default location: Kolkata
  const [weatherData, setWeatherData] = useState(mockLocations.kolkata);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherCondition() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error(
      "useWeatherCondition must be used inside a WeatherProvider"
    );
  }

  return context;
}