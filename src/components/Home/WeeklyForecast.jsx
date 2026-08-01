import { useWeatherCondition } from "../../Context/WeatherContext.jsx";
import { Droplet } from "lucide-react";

// Placeholder sample data — will be replaced with real backend forecast data.
// Shape: { day, date, icon, high, low, precipitation }
const sampleWeekly = [
  { day: "Fri", date: "31 Jul", icon: "☁️", high: 8, low: 2, precipitation: 20 },
  { day: "Sat", date: "1 Aug", icon: "☀️", high: 11, low: 3, precipitation: 10 },
  { day: "Sun", date: "2 Aug", icon: "☁️", high: 9, low: 2, precipitation: 60 },
  { day: "Mon", date: "3 Aug", icon: "🌧️", high: 7, low: 1, precipitation: 15 },
  { day: "Tue", date: "4 Aug", icon: "🌤️", high: 10, low: 2, precipitation: 18 },
  { day: "Wed", date: "5 Aug", icon: "☁️", high: 9, low: 2, precipitation: 25 },
  { day: "Thu", date: "6 Aug", icon: "☀️", high: 11, low: 3, precipitation: 10 },
];

const WeeklyForecast = () => {
  const { weatherData, forecastData } = useWeatherCondition();

  if (!weatherData) return null;

  const weekly = forecastData?.weekly?.length ? forecastData.weekly : sampleWeekly;

  return (
    <div
      className="
        glass-card
        card-premium
        delay-2
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
      <div className="glow-blob glow-blob-purple w-56 h-56 -top-16 -left-16"></div>
      <div className="glow-blob glow-blob-blue w-40 h-40 bottom-0 right-10"></div>

      <h2 className="text-white text-lg font-semibold tracking-tight">
        Weekly Forecast
      </h2>

      <div
        className="flex-1 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${weekly.length}, 1fr)` }}
      >
        {weekly.map((day, index) => (
          <div
            key={day.day}
            className={`
              mini-card
              stat-row-in
              flex
              flex-col
              items-center
              justify-between
              gap-2
              py-3
              px-2
              rounded-2xl
              ${index === 0 ? "highlight-slot" : ""}
            `}
            style={{ animationDelay: `${0.1 + index * 0.06}s` }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm text-white font-medium whitespace-nowrap">
                {day.day}
              </span>
              <span className="text-[11px] text-gray-400 whitespace-nowrap">
                {day.date}
              </span>
            </div>

            <div className="icon-badge w-11 h-11">
              <span className="icon-float text-xl">{day.icon}</span>
            </div>

            <div className="flex items-center gap-1 text-sm whitespace-nowrap">
              <span className="gradient-text-blue font-semibold">{day.high}°</span>
              <span className="text-gray-500">{day.low}°</span>
            </div>

            <span className="flex items-center gap-1 text-[11px] text-blue-300">
              <Droplet size={11} />
              {day.precipitation}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;