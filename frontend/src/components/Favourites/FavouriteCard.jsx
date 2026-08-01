import { X } from "lucide-react";
import {
    getWeatherTheme,
    getConditionKey,
} from "../Weather/WeatherThemes";

const emojiByKey = {
    sunny: "☀️",
    cloudy: "☁️",
    rain: "🌧️",
    thunderstorm: "⛈️",
    fog: "🌫️",
    windy: "💨",
    snow: "❄️",
};

function FavouriteCard({
    city,
    weather,
    loading,
    onRemove,
    onSelect,
}) {
    const condition =
        weather?.weather?.[0]?.description ||
        weather?.weather?.[0]?.main;

    const theme = getWeatherTheme(condition);
    const key = getConditionKey(condition);
    const emoji = key ? emojiByKey[key] : "🌤️";

    return (
        <div
            onClick={() => onSelect?.(city)}
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                glass-card
                card-premium
                px-4
                sm:px-6
                py-5
                sm:py-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-white/20
                cursor-pointer
            "
        >

            {/* Background */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/20
                    pointer-events-none
                "
            />

            <div
                className="
                    absolute
                    -top-8
                    -right-8
                    w-32
                    h-32
                    sm:w-40
                    sm:h-40
                    bg-white/10
                    rounded-full
                    blur-[60px]
                    pointer-events-none
                "
            />


            {/* Remove Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(city.lat, city.lon);
                }}
                className="
                    absolute
                    top-3
                    right-3
                    z-10
                    w-7
                    h-7
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    opacity-100
                    md:opacity-0
                    md:group-hover:opacity-100
                    hover:bg-red-500/10
                    hover:text-red-400
                    transition-all
                    duration-200
                    cursor-pointer
                "
                title="Remove from favourites"
            >
                <X size={14} />
            </button>


            {/* Main Content */}
            <div
                className="
                    relative
                    flex
                    items-center
                    gap-3
                    sm:gap-4
                    min-w-0
                "
            >

                {/* Weather Icon */}
                <span
                    className="
                        icon-float
                        text-4xl
                        sm:text-5xl
                        shrink-0
                    "
                >
                    {loading ? "🌤️" : emoji}
                </span>


                {/* City + Condition */}
                <div
                    className="
                        flex-1
                        min-w-0
                        pr-1
                    "
                >
                    <h3
                        className="
                            text-white
                            font-semibold
                            text-sm
                            sm:text-base
                            truncate
                        "
                    >
                        {city.name}
                        {city.country
                            ? `, ${city.country}`
                            : ""}
                    </h3>

                    <p
                        className={`
                            text-[11px]
                            sm:text-xs
                            mt-0.5
                            capitalize
                            truncate
                            ${theme.accent}
                        `}
                    >
                        {loading
                            ? "Loading..."
                            : condition || "—"}
                    </p>
                </div>


                {/* Temperature */}
                <div
                    className="
                        text-right
                        shrink-0
                        mt-5
                        sm:mt-0
                    "
                >
                    {!loading &&
                    weather?.main?.temp !==
                        undefined ? (
                        <>
                            <div
                                className="
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    gradient-text-blue
                                    leading-none
                                "
                            >
                                {Math.round(
                                    weather.main.temp
                                )}
                                °
                            </div>

                            <div
                                className="
                                    text-[10px]
                                    sm:text-[11px]
                                    text-gray-400
                                    mt-1
                                "
                            >
                                Feels{" "}
                                {Math.round(
                                    weather.main
                                        .feels_like
                                )}
                                °
                            </div>
                        </>
                    ) : (
                        <div
                            className="
                                w-9
                                sm:w-10
                                h-6
                                rounded
                                bg-white/10
                                animate-pulse
                                ml-auto
                            "
                        />
                    )}
                </div>

            </div>


            {/* Bottom Weather Info */}
            {!loading &&
                weather?.main && (
                    <div
                        className="
                            relative
                            mt-4
                            pt-3
                            border-t
                            border-white/10
                            flex
                            flex-wrap
                            gap-x-4
                            gap-y-2
                            text-[11px]
                            sm:text-xs
                            text-gray-300
                        "
                    >
                        <span>
                            💧 {weather.main.humidity}%
                        </span>

                        {weather.wind?.speed !==
                            undefined && (
                            <span>
                                🌬️{" "}
                                {Math.round(
                                    weather.wind.speed
                                )}{" "}
                                m/s
                            </span>
                        )}
                    </div>
                )}

        </div>
    );
}

export default FavouriteCard;