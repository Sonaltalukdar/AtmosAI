// Central config: each weather condition maps to a background gradient + accent color.
// Add/edit here only — no need to touch component logic when tweaking colors.

export const weatherThemes = {
    sunny: {
        label: "Sunny",
        bg: "sky-sunny",
        bgImage: "/weather-bg/sunny.jpg",
        accent: "text-amber-300",
        glow: "shadow-[0_0_70px_rgba(251,146,60,0.4)]",
    },
    cloudy: {
        label: "Cloudy",
        bg: "sky-cloudy",
        bgImage: "/weather-bg/cloudy.jpg",
        accent: "text-sky-300",
        glow: "shadow-[0_0_70px_rgba(56,189,248,0.35)]",
    },
    rain: {
        label: "Rain",
        bg: "sky-rain",
        bgImage: "/weather-bg/rain.jpg",
        accent: "text-blue-300",
        glow: "shadow-[0_0_70px_rgba(59,130,246,0.4)]",
    },
    thunderstorm: {
        label: "Thunderstorm",
        bg: "sky-thunderstorm",
        bgImage: "/weather-bg/thunderstorm.jpg",
        accent: "text-indigo-300",
        glow: "shadow-[0_0_70px_rgba(99,102,241,0.45)]",
    },
    fog: {
        label: "Fog / Haze",
        bg: "sky-fog",
        bgImage: "/weather-bg/fog.jpg",
        accent: "text-slate-300",
        glow: "shadow-[0_0_70px_rgba(148,163,184,0.3)]",
    },
    windy: {
        label: "Windy",
        bg: "sky-windy",
        bgImage: "/weather-bg/windy.jpg",
        accent: "text-cyan-300",
        glow: "shadow-[0_0_70px_rgba(45,212,191,0.35)]",
    },
    snow: {
        label: "Snow",
        bg: "sky-snow",
        bgImage: "/weather-bg/snow.jpg",
        accent: "text-blue-200",
        glow: "shadow-[0_0_70px_rgba(129,140,248,0.4)]",
    },
};

// Fallback if an unknown condition string comes in — also what shows
// on the "Getting your weather ready" loading screen before data loads.
export const defaultTheme = {
    label: "Unknown",
    bg: "bg-gradient-to-br from-[#0a0e16] via-[#0d1220] to-[#05070d]",
    accent: "text-gray-300",
    glow: "",
};

// Keyword map: checks if the condition string CONTAINS these words,
// so full labels like "Partly Cloudy" or "Heavy Rain" still match correctly.
const keywordMap = [
    { keywords: ["thunder", "storm"], key: "thunderstorm" },
    { keywords: ["rain", "drizzle", "shower"], key: "rain" },
    { keywords: ["snow", "sleet"], key: "snow" },
    { keywords: ["fog", "haze", "mist"], key: "fog" },
    { keywords: ["wind"], key: "windy" },
    { keywords: ["cloud", "overcast"], key: "cloudy" },
    { keywords: ["sun", "clear"], key: "sunny" },
];

// Returns the normalized key ("cloudy", "rain", etc.) or null if no match.
// Used by WeatherBackground to decide which ANIMATED layer to render.
export function getConditionKey(condition) {
    if (!condition) return null;
    const text = condition.toLowerCase();

    if (weatherThemes[text]) return text;

    const match = keywordMap.find(({ keywords }) =>
        keywords.some((word) => text.includes(word))
    );

    return match ? match.key : null;
}

export function getWeatherTheme(condition) {
    const key = getConditionKey(condition);
    return key ? weatherThemes[key] : defaultTheme;
}