import { useWeatherCondition } from "../../Context/WeatherContext.jsx";
import { Droplet } from "lucide-react";

// Placeholder sample data — will be replaced with real backend forecast data.
// Shape: { time, icon, temp, precipitation }
const sampleHourly = [
  { time: "Now", icon: "☁️", temp: 6, precipitation: 0 },
  { time: "11 AM", icon: "☁️", temp: 7, precipitation: 0 },
  { time: "12 PM", icon: "🌤️", temp: 8, precipitation: 10 },
  { time: "1 PM", icon: "☀️", temp: 9, precipitation: 10 },
  { time: "2 PM", icon: "☁️", temp: 8, precipitation: 20 },
  { time: "3 PM", icon: "🌧️", temp: 7, precipitation: 30 },
];

const HourlyForecast = () => {
  const { weatherData, forecastData } = useWeatherCondition();

  if (!weatherData) return null;

  const hourly = forecastData?.hourly?.length ? forecastData.hourly : sampleHourly;

  return (
    <div
      className="
        glass-card
        card-premium
        delay-1
        relative
        p-8
        w-full
        h-full
        flex
        flex-col
        gap-6
        overflow-hidden
        box-border
        rounded-3xl
      "
    >
      {/* Ambient glow blobs for depth */}
      <div className="glow-blob glow-blob-blue w-56 h-56 -top-16 -right-16"></div>
      <div className="glow-blob glow-blob-purple w-40 h-40 bottom-0 left-10"></div>

      <h2 className="text-white text-lg font-semibold tracking-tight">
        Hourly Forecast
      </h2>

      <div className="flex-1 grid grid-cols-6 gap-2">
        {hourly.map((slot, index) => (
          <div
            key={slot.time}
            className={`
              mini-card
              stat-row-in
              flex
              flex-col
              items-center
              justify-between
              gap-2.5
              py-3
              rounded-2xl
              ${index === 0 ? "highlight-slot" : ""}
            `}
            style={{ animationDelay: `${0.1 + index * 0.06}s` }}
          >
            <span className="text-xs text-gray-300 font-medium whitespace-nowrap">
              {slot.time}
            </span>

            <div className="icon-badge">
              <span className="icon-float text-2xl">{slot.icon}</span>
            </div>

            <span className="gradient-text-blue font-semibold text-lg">
              {slot.temp}°
            </span>

            <span className="flex items-center gap-1 text-[11px] text-blue-300">
              <Droplet size={11} />
              {slot.precipitation}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;