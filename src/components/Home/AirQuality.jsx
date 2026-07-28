import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Wind } from "lucide-react";
import { useWeatherCondition } from "../../Context/WeatherContext.jsx";

const AirQuality = () => {
    const { weatherData } = useWeatherCondition();
    const { value: aqi, status, statusColor, pollutants } = weatherData.aqi;
    const locationLabel = weatherData.location.split(",")[0]; // short label e.g. "Kolkata"

    const [displayAqi, setDisplayAqi] = useState(0);

    useEffect(() => {
        let start = null;
        const duration = 1200; // ms, matches ring's pathTransitionDuration

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setDisplayAqi(Math.round(progress * aqi));
            if (progress < 1) requestAnimationFrame(step);
        };

        const raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [aqi]);

    return (
        <div className="aqi-fade-in bg-transparent shadow-none p-8 flex flex-col box-border max-w-2xl">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Wind size={22} className="text-emerald-400 flex-shrink-0" />
                    <h3 className="text-white font-semibold text-xl">Air Quality Index</h3>
                </div>
                <span className="text-sm text-gray-400 whitespace-nowrap">{locationLabel}</span>
            </div>

            <div className="flex items-center gap-10" style={{ marginTop: "32px" }}>

                {/* Left: Circular gauge + status */}
                <div className="flex flex-col items-center shrink-0 w-36">
                    <div className="w-32 h-32">
                        <CircularProgressbar
                            value={displayAqi}
                            maxValue={200}
                            text={`${displayAqi}`}
                            styles={buildStyles({
                                textColor: "#fff",
                                pathColor: statusColor,
                                trailColor: "rgba(255,255,255,0.06)",
                                textSize: "26px",
                                pathTransitionDuration: 0.3,
                            })}
                        />
                    </div>
                    <p className="font-semibold mt-3 text-base" style={{ color: statusColor }}>
                        {status}
                    </p>
                    <p className="text-center text-gray-500 text-xs mt-1 leading-snug">
                        {status === "Good" ? "Little to no risk" : "Sensitive groups take care"}
                    </p>
                </div>

                {/* Right: Pollutant breakdown */}
                <div className="flex-1 min-w-0 space-y-5">
                    {pollutants.map((p, i) => (
                        <div key={p.label} className="aqi-row" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                                <span className="text-gray-400 font-medium">{p.label}</span>
                                <span className="text-white font-semibold">{p.value}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className="aqi-bar-fill h-full rounded-full"
                                    style={{ "--fill-width": `${p.pct}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AirQuality;