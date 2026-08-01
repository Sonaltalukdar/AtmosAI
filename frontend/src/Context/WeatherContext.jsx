import { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        forecastData,
        setForecastData,
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