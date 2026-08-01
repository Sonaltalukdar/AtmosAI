const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// OpenWeatherMap tile layers — clouds, precipitation, wind, temp, pressure
export const WEATHER_LAYERS = {
  temp: {
    label: "Temperature",
    tileUrl: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    legend: [
      { color: "#3b82f6", label: "-20°C" },
      { color: "#22d3ee", label: "0°C" },
      { color: "#facc15", label: "20°C" },
      { color: "#f97316", label: "35°C" },
      { color: "#ef4444", label: "45°C+" },
    ],
  },
  wind: {
    label: "Wind Speed",
    tileUrl: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    legend: [
      { color: "#a5f3fc", label: "0 m/s" },
      { color: "#38bdf8", label: "5 m/s" },
      { color: "#6366f1", label: "10 m/s" },
      { color: "#7c3aed", label: "20 m/s+" },
    ],
  },
  precipitation: {
    label: "Precipitation",
    tileUrl: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    legend: [
      { color: "#93c5fd", label: "Light" },
      { color: "#3b82f6", label: "Moderate" },
      { color: "#1e40af", label: "Heavy" },
      { color: "#7e22ce", label: "Extreme" },
    ],
  },
  clouds: {
    label: "Clouds",
    tileUrl: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    legend: [
      { color: "#4b5563", label: "0%" },
      { color: "#9ca3af", label: "50%" },
      { color: "#e5e7eb", label: "100%" },
    ],
  },
  aqi: {
    label: "Air Quality",
    tileUrl: null,
    legend: [
      { color: "#22c55e", label: "Good" },
      { color: "#eab308", label: "Moderate" },
      { color: "#f97316", label: "Unhealthy" },
      { color: "#ef4444", label: "Hazardous" },
    ],
  },
};

// Point weather fetch 
export async function getWeatherAtPoint(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather at this location");
  }

  return res.json();
}

// AQI at point 
export async function getAQIAtPoint(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch AQI at this location");
  }

  return res.json();
}

// City search (forward geocoding)
export async function searchCity(query) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&limit=10&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to search city");
  }

  return res.json();
}