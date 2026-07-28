// weatherThemes.js
// Central config: each weather condition maps to a background gradient + accent color.
// Add/edit here only — no need to touch component logic when tweaking colors.

export const weatherThemes = {
    sunny: {
        label: "Sunny",
        bg: "bg-gradient-to-br from-amber-300 via-orange-400 to-yellow-500",
        accent: "text-amber-500",
        glow: "shadow-[0_0_60px_rgba(251,191,36,0.35)]",
    },
    cloudy: {
        label: "Cloudy",
        bg: "bg-gradient-to-br from-slate-600 via-slate-700 to-gray-700",
        accent: "text-slate-300",
        glow: "shadow-[0_0_60px_rgba(148,163,184,0.3)]",
    },
    rain: {
        label: "Rain",
        bg: "bg-gradient-to-br from-blue-600 via-slate-700 to-blue-900",
        accent: "text-blue-300",
        glow: "shadow-[0_0_60px_rgba(59,130,246,0.35)]",
    },
    thunderstorm: {
        label: "Thunderstorm",
        bg: "bg-gradient-to-br from-slate-800 via-indigo-900 to-gray-950",
        accent: "text-indigo-300",
        glow: "shadow-[0_0_60px_rgba(99,102,241,0.4)]",
    },
    fog: {
        label: "Fog / Haze",
        bg: "bg-gradient-to-br from-gray-300 via-gray-400 to-slate-500",
        accent: "text-gray-200",
        glow: "shadow-[0_0_60px_rgba(203,213,225,0.3)]",
    },
    windy: {
        label: "Windy",
        bg: "bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600",
        accent: "text-teal-200",
        glow: "shadow-[0_0_60px_rgba(45,212,191,0.3)]",
    },
    snow: {
        label: "Snow",
        bg: "bg-gradient-to-br from-slate-300 via-blue-400 to-indigo-600",
        accent: "text-blue-100",
        glow: "shadow-[0_0_60px_rgba(96,165,250,0.45)]",
    },
};

// Fallback if an unknown condition string comes in
export const defaultTheme = {
    label: "Unknown",
    bg: "bg-gradient-to-br from-gray-600 to-gray-800",
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