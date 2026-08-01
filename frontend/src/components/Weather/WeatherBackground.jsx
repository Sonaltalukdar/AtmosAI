import { getWeatherTheme, getConditionKey } from "./WeatherThemes";

/* ---------- Individual animated layers ---------- */

function SunnyLayer() {
    return (
        <div
            className="weather-sun-glow"
            style={{ top: "8%", right: "12%", width: 280, height: 280 }}
        />
    );
}

/* A properly-drawn cloud shape (classic overlapping-puff silhouette),
   not a blurry blob. Reused at different sizes/opacities for depth. */
function CloudShape({ width = 200, opacity = 0.55 }) {
    const height = width * 0.55;
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 200 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity, display: "block" }}
        >
            <path
                d="M50 95
                   C25 95 10 78 10 62
                   C10 47 22 35 38 34
                   C41 17 57 5 76 5
                   C93 5 108 15 114 30
                   C116 29.5 118.5 29 121 29
                   C140 29 155 44 155 63
                   C155 63.5 155 64 155 64.5
                   C170 66 182 78 182 92
                   C182 94 181.8 95 181.5 95
                   Z"
                fill="white"
            />
        </svg>
    );
}

function CloudyLayer() {
    // A handful of real cloud shapes drifting at different speeds/heights/depths.
    const clouds = [
        { top: "8%", width: 260, opacity: 0.5, dur: 42, delay: 0 },
        { top: "24%", width: 170, opacity: 0.35, dur: 58, delay: -18 },
        { top: "4%", width: 320, opacity: 0.6, dur: 70, delay: -35 },
        { top: "34%", width: 140, opacity: 0.3, dur: 50, delay: -8 },
        { top: "16%", width: 200, opacity: 0.45, dur: 63, delay: -25 },
    ];
    return (
        <>
            {clouds.map((c, i) => (
                <div
                    key={i}
                    className="weather-cloud-shape"
                    style={{
                        top: c.top,
                        animationDuration: `${c.dur}s`,
                        animationDelay: `${c.delay}s`,
                    }}
                >
                    <CloudShape width={c.width} opacity={c.opacity} />
                </div>
            ))}
        </>
    );
}

function RainLayer() {
    const drops = Array.from({ length: 28 }, (_, i) => ({
        left: `${(i * 3.6) % 100}%`,
        height: 60 + ((i * 13) % 60),
        dur: 0.7 + ((i % 5) * 0.15),
        delay: -(i % 10) * 0.3,
    }));
    return (
        <>
            {drops.map((d, i) => (
                <div
                    key={i}
                    className="weather-raindrop"
                    style={{
                        left: d.left,
                        height: d.height,
                        animationDuration: `${d.dur}s`,
                        animationDelay: `${d.delay}s`,
                    }}
                />
            ))}
        </>
    );
}

function ThunderstormLayer() {
    return (
        <>
            <RainLayer />
            {/* thunderstorm skies are also cloudy — layer a couple of dark clouds in */}
            <div className="weather-cloud-shape" style={{ top: "6%", animationDuration: "50s" }}>
                <CloudShape width={260} opacity={0.4} />
            </div>
            <div className="weather-cloud-shape" style={{ top: "20%", animationDuration: "65s", animationDelay: "-20s" }}>
                <CloudShape width={180} opacity={0.3} />
            </div>
            <div className="weather-lightning" />
        </>
    );
}

/* Smoke-style fog: soft, blurred, drifting layers of varying size/height/opacity */
function FogLayer() {
  const fogs = [
    { top: "10%", width: 900, height: 260, dur: 60, delay: 0, opacity: 0.4, scale: 1.2 },
    { top: "35%", width: 700, height: 220, dur: 48, delay: -20, opacity: 0.3, scale: 0.9 },
    { top: "60%", width: 1000, height: 280, dur: 70, delay: -35, opacity: 0.35, scale: 1.3 },
    { top: "80%", width: 650, height: 200, dur: 40, delay: -10, opacity: 0.28, scale: 1.0 },
  ];

  return (
    <>
      {fogs.map((fog, i) => (
        <div
          key={i}
          className="weather-fog-layer"
          style={{
            top: fog.top,
            width: fog.width,
            height: fog.height,
            opacity: fog.opacity,
            transform: `scale(${fog.scale})`,
            animationDuration: `${fog.dur}s`,
            animationDelay: `${fog.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function WindyLayer() {
  const streaks = Array.from({ length: 8 }, (_, i) => ({
    top: `${10 + i * 10}%`,
    width: 120 + (i % 3) * 60,
    dur: 2.5 + (i % 3) * 0.6,
    delay: -(i % 5),
  }));

  return (
    <>
      {/* Wind Streaks */}
      {streaks.map((s, i) => (
        <div
          key={i}
          className="weather-wind-streak"
          style={{
            top: s.top,
            width: s.width,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Main Wind Turbine - Center Gap */}
      <div
        className="wind-turbine"
        style={{
          left: "43%",
          bottom: "-20px",
          transform: "translateX(-50%) scale(1.15)",
        }}
      >
        <div className="tower"></div>

        <div className="hub">
          <span className="blade blade1"></span>
          <span className="blade blade2"></span>
          <span className="blade blade3"></span>
        </div>
      </div>

      {/* Small Distant Turbine */}
      <div
        className="wind-turbine opacity-40"
        style={{
          left: "88%",
          bottom: "-35px",
          transform: "translateX(-50%) scale(.75)",
        }}
      >
        <div className="tower"></div>

        <div className="hub">
          <span className="blade blade1"></span>
          <span className="blade blade2"></span>
          <span className="blade blade3"></span>
        </div>
      </div>
    </>
  );
}

function SnowLayer() {
    const flakes = Array.from({ length: 30 }, (_, i) => ({
        left: `${(i * 3.3) % 100}%`,
        size: 3 + (i % 4),
        dur: 6 + (i % 6),
        delay: -(i % 10) * 0.6,
    }));
    return (
        <>
            {flakes.map((f, i) => (
                <div
                    key={i}
                    className="weather-snowflake"
                    style={{
                        left: f.left,
                        width: f.size,
                        height: f.size,
                        animationDuration: `${f.dur}s`,
                        animationDelay: `${f.delay}s`,
                    }}
                />
            ))}
        </>
    );
}

const layerByKey = {
    sunny: SunnyLayer,
    cloudy: CloudyLayer,
    rain: RainLayer,
    thunderstorm: ThunderstormLayer,
    fog: FogLayer,
    windy: WindyLayer,
    snow: SnowLayer,
};

/**
 * WeatherBackground
 * Wraps the ENTIRE page: applies the base gradient for the current
 * condition PLUS a matching animated layer (drifting clouds, falling
 * rain/snow, lightning flashes, fog bands, wind streaks...).
 *
 * Usage:
 *   <WeatherBackground condition="Partly Cloudy">
 *      <Navbar />
 *      <Routes>...</Routes>
 *   </WeatherBackground>
 */
function WeatherBackground({ condition, children }) {
    const theme = getWeatherTheme(condition);
    const key = getConditionKey(condition);
    const Layer = key ? layerByKey[key] : null;

    return (
        <div
            className={`
                relative
                min-h-screen
                w-full
                overflow-hidden
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
            {/* Animated weather layer (clouds/rain/snow/etc.), clipped to viewport */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Layer && <Layer />}
            </div>

            {/* subtle dark overlay so all existing text/cards stay readable */}
            <div className="absolute inset-0 bg-black/22 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export default WeatherBackground;