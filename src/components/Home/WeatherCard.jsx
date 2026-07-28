import { Droplets, Wind, Gauge, Sun, Eye, MapPin } from "lucide-react";
import { getWeatherTheme } from "../Weather/WeatherThemes";
import { useWeatherCondition } from "../../Context/WeatherContext.jsx";

const WeatherCard = () => {
  const { weatherData } = useWeatherCondition();

  if (!weatherData) return null;

  const weather = weatherData;
  const theme = getWeatherTheme(weather.condition);

  const stats = [
    {
      icon: Droplets,
      label: "Humidity",
      value: `${weather.humidity}%`,
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${weather.windSpeed} km/h`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${weather.pressure} hPa`,
    },
    {
      icon: Sun,
      label: "UV Index",
      value: weather.uvIndex,
    },
    {
      icon: Eye,
      label: "Visibility",
      value: `${weather.visibility} km`,
    },
  ];

  return (
    <div
      className={`
        relative
        p-12
        w-full
        h-full
        flex
        flex-col
        justify-center
        gap-8
        overflow-hidden
        box-border
        rounded-3xl
        transition-colors
        duration-700
        ${theme.bg}
        ${theme.glow}
      `}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-2 text-white font-medium text-base min-w-0">
          <MapPin size={18} className="text-blue-400 shrink-0" />

          <span className="truncate">
            {weather.location}
          </span>

          <span className="live-dot w-2 h-2 rounded-full bg-green-400 ml-1 shrink-0"></span>
        </div>

        <span className="text-sm text-gray-300 whitespace-nowrap">
          {weather.date}
        </span>
      </div>

      {/* Temperature */}
      <div className="relative flex items-center justify-between gap-6">

        <div className="flex items-center gap-4">

          <div className="w-20 h-20 flex items-center justify-center">
            <span className="icon-float text-7xl">
              {weather.icon}
            </span>
          </div>

          <div>
            <h1 className="temp-pop text-6xl font-bold text-white">
              {weather.temp}°
            </h1>

            <p className={`font-medium text-base ${theme.accent}`}>
              {weather.condition}
            </p>

            <p className="text-sm text-gray-300 mt-1">
              Feels like {weather.feelsLike}°C
            </p>
          </div>

        </div>

        {/* Weather Stats */}
        <div className="space-y-2">

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-row stat-row-in flex items-center justify-between gap-6 py-1.5 px-2"
              style={{
                animationDelay: `${0.15 + index * 0.08}s`,
              }}
            >
              <span className="flex items-center gap-2 text-gray-200 whitespace-nowrap">
                <stat.icon
                  size={16}
                  className={theme.accent}
                />

                {stat.label}
              </span>

              <span className="font-medium text-white whitespace-nowrap">
                {stat.value}
              </span>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default WeatherCard;