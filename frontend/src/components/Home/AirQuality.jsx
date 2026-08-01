import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Wind, Leaf } from "lucide-react";
import { useWeatherCondition } from "../../Context/WeatherContext.jsx";

const AirQuality = () => {
    const { weatherData } = useWeatherCondition();

    // Hooks MUST run on every render, in the same order — so they go
    // above any early return. Using weatherData?.aqi?.value keeps this
    // safe even before weatherData has loaded.
    const aqi = weatherData?.aqi?.value;
    const [displayAqi, setDisplayAqi] = useState(0);

    useEffect(() => {
        if (aqi === undefined) return;

        let start = null;
        const duration = 1200;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setDisplayAqi(Math.round(progress * aqi));
            if (progress < 1) requestAnimationFrame(step);
        };

        const raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [aqi]);

    if (!weatherData) return null;

    const { status, statusColor, pollutants } = weatherData.aqi;
    const locationLabel = weatherData.location.split(",")[0];

    const isGood = status === "Good" || status === "Fair";

    return (
        <div
            className="
                aqi-fade-in
                glass-card
                card-premium
                delay-3
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
            <div className="glow-blob glow-blob-green w-56 h-56 -top-16 -right-16"></div>
            <div className="glow-blob glow-blob-blue w-40 h-40 bottom-0 left-10"></div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="icon-badge w-10 h-10">
                        <Wind size={18} className="text-emerald-400 flex-shrink-0" />
                    </div>
                    <h3 className="text-white font-semibold text-xl tracking-tight">
                        Air Quality Index
                    </h3>
                </div>

                <span
                    className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap bg-white/[0.06] border border-white/10"
                    style={{ color: statusColor }}
                >
                    {status}
                </span>
            </div>

            <span className="text-sm text-gray-400 -mt-4">{locationLabel}</span>

            <div className="flex items-center gap-10 flex-1">

                <div className="flex flex-col items-center shrink-0 w-36">
                    <div className="relative w-32 h-32">
                        {/* Hidden SVG defs to give the ring a green -> blue -> purple gradient */}
                        <svg width="0" height="0">
                            <defs>
                                <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="relative">
                            <CircularProgressbar
                                value={displayAqi}
                                maxValue={200}
                                text={`${displayAqi}`}
                                styles={buildStyles({
                                    textColor: "#fff",
                                    pathColor: "url(#aqiGradient)",
                                    trailColor: "rgba(255,255,255,0.06)",
                                    textSize: "26px",
                                    pathTransitionDuration: 0.3,
                                })}
                            />
                        </div>
                    </div>
                    <p className="font-semibold mt-3 text-base" style={{ color: statusColor }}>
                        {status}
                    </p>
                    <p className="text-center text-gray-500 text-xs mt-1 leading-snug">
                        {isGood ? "Little to no risk" : "Sensitive groups take care"}
                    </p>
                </div>

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

            {isGood && (
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 backdrop-blur-md">
                    <Leaf size={14} />
                    Air quality is ideal for most outdoor activities
                </div>
            )}
        </div>
    );
};

export default AirQuality;