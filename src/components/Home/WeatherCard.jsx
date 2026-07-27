import { Droplets, Wind, Gauge, Sun, Eye, MapPin } from "lucide-react";

const WeatherCard = ({ data }) => {
  const weather = data || {
    location: "Kolkata, West Bengal",
    date: "Today, 12 June",
    temp: 29,
    condition: "Partly Cloudy",
    feelsLike: 31,
    icon: "🌤️",
    humidity: 75,
    windSpeed: 12,
    pressure: 1012,
    uvIndex: "Moderate",
    visibility: 8,
  };

  const stats = [
    { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
    { icon: Wind, label: "Wind Speed", value: `${weather.windSpeed} km/h` },
    { icon: Gauge, label: "Pressure", value: `${weather.pressure} hPa` },
    { icon: Sun, label: "UV Index", value: weather.uvIndex },
    { icon: Eye, label: "Visibility", value: `${weather.visibility} km` },
  ];

  return (
    <div className="relative p-12 w-full h-full flex flex-col justify-center gap-8 overflow-hidden box-border">
      {/* Top row: location + live badge + date */}
      <div className="relative flex items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-2 text-white font-medium min-w-0 shrink text-base">
          <MapPin size={18} className="text-blue-400 shrink-0" />
          <span className="truncate">{weather.location}</span>
          <span className="live-dot w-2 h-2 rounded-full bg-green-400 ml-1 shrink-0"></span>
        </div>
        <span className="text-sm text-gray-400 shrink-0 whitespace-nowrap">{weather.date}</span>
      </div>

      {/* Main temp row */}
      <div className="relative flex items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 shrink-0">
          {/* Icon */}
          <div className="relative flex items-center justify-center w-20 h-20">
            <span className="icon-float relative text-7xl">{weather.icon}</span>
          </div>

          <div>
            <h1 className="temp-pop text-6xl font-bold text-white">
              {weather.temp}°
            </h1>
            <p className="font-medium text-base text-blue-400">{weather.condition}</p>
            <p className="text-sm text-gray-400">
              Feels like {weather.feelsLike}°C
            </p>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-300 shrink-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-row stat-row-in flex items-center justify-between gap-4 py-1.5 px-2"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <stat.icon size={16} className="text-blue-400" /> {stat.label}
              </span>
              <span className="text-white font-medium whitespace-nowrap">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;