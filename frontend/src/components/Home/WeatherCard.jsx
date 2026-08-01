import { useState, useEffect } from "react";
import { Droplets, Wind, Gauge, Sun, Eye, MapPin, RefreshCw } from "lucide-react";
import { getWeatherTheme } from "../Weather/WeatherThemes";
import { useWeatherCondition } from "../../Context/WeatherContext.jsx";

// Turns a timestamp into "Just now" / "X min ago" / "X hr ago"
function getRelativeTime(timestamp) {
  if (!timestamp) return "Just now";

  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin === 1) return "1 min ago";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  return diffHr === 1 ? "1 hr ago" : `${diffHr} hr ago`;
}

const WeatherCard = () => {
  const { weatherData } = useWeatherCondition();

  // Ticks every 30s just to re-render so "Updated X min ago" stays fresh
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) return null;

  const weather = weatherData;
  const theme = getWeatherTheme(weather.condition);

  const stats = [
    { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
    { icon: Wind, label: "Wind Speed", value: `${weather.windSpeed} km/h` },
    { icon: Gauge, label: "Pressure", value: `${weather.pressure} hPa` },
    { icon: Eye, label: "Visibility", value: `${weather.visibility} km` },
    { icon: Sun, label: "UV Index", value: weather.uvIndex },
  ];

  return (
    <div
      className={`
        glass-card
        card-premium
        relative
        p-10
        w-full
        h-full
        flex
        flex-col
        justify-between
        gap-6
        overflow-hidden
        box-border
        rounded-3xl
        transition-colors
        duration-700
        ${theme.bg}
      `}
      style={
        theme.bgImage
          ? {
              backgroundImage: `url(${theme.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Decorative blurred glow, echoes the marketing hero's cloud motif */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-white font-medium text-base min-w-0">
            <MapPin size={18} className="text-blue-300 shrink-0" />

            <span className="truncate">{weather.location}</span>

            <span className="live-dot w-2 h-2 rounded-full bg-green-400 ml-1 shrink-0"></span>
          </div>

          <span className="text-sm text-gray-300 whitespace-nowrap">
            {weather.date}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-300 whitespace-nowrap shrink-0 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <RefreshCw size={12} />
          Updated {getRelativeTime(weather.updatedAt)}
        </div>
      </div>

      {/* Temperature */}
      <div className="relative flex items-center gap-5">
        <span className="icon-float text-7xl shrink-0">{weather.icon}</span>

        <div>
          <h1 className="temp-pop gradient-text-blue text-6xl font-bold leading-none">
            {weather.temp}°
          </h1>

          <p className={`font-medium text-base mt-2 ${theme.accent}`}>
            {weather.condition}
          </p>

          <p className="text-sm text-gray-300 mt-1">
            Feels like {weather.feelsLike}°C
          </p>
        </div>
      </div>

      {/* Weather Stats — horizontal row along the bottom */}
      <div className="relative grid grid-cols-5 gap-3 pt-4 border-t border-white/10">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="mini-card stat-row-in flex flex-col items-center text-center gap-1.5 py-2 rounded-2xl"
            style={{ animationDelay: `${0.15 + index * 0.08}s` }}
          >
            <stat.icon size={16} className={theme.accent} />

            <span className="text-[11px] text-gray-300 whitespace-nowrap">
              {stat.label}
            </span>

            <span className="font-medium text-sm text-white whitespace-nowrap">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;