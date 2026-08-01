import express from "express";
import axios from "axios";

const router = express.Router();

const aqiMap = {
  1: { status: "Good", color: "#22c55e" },
  2: { status: "Fair", color: "#84cc16" },
  3: { status: "Moderate", color: "#eab308" },
  4: { status: "Poor", color: "#f97316" },
  5: { status: "Very Poor", color: "#ef4444" },
};

const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));

// Reverse-geocode lat/lon to an accurate locality name using BigDataCloud.
// OpenWeatherMap's own "name" field snaps to the nearest city in ITS database,
// which can be far off in smaller towns/villages. BigDataCloud's free client-reverse-geocode
// endpoint needs no API key and, unlike Nominatim, does not block server-side/backend traffic.
const getLocationName = async (lat, lon) => {
  try {
    const res = await axios.get("https://api.bigdatacloud.net/data/reverse-geocode-client", {
      params: {
        latitude: lat,
        longitude: lon,
        localityLanguage: "en",
      },
    });

    const d = res.data || {};

    // Temporary debug log — shows exactly what BigDataCloud returns for these coords.
    // Remove this once we confirm the correct field is being picked.
    console.log("BigDataCloud raw response:", JSON.stringify(d, null, 2));

    // localityInfo.administrative holds admin levels from country down to
    // village/town/block, each with an "order" — higher order = more granular.
    // This is usually more precise than the top-level "city" field, which
    // often snaps to the nearest big/known city.
    const admin = (d.localityInfo && d.localityInfo.administrative) || [];
    const mostGranular = [...admin].sort((a, b) => (b.order || 0) - (a.order || 0))[0];

    const name =
      d.locality ||
      mostGranular?.name ||
      d.city ||
      d.principalSubdivision ||
      null;

    return {
      name: name || null,
      country: d.countryCode || null,
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error.message);
    return { name: null, country: null };
  }
};

const buildResponse = (weatherRes, aqiRes, location) => {
  const w = weatherRes.data;
  const a = aqiRes.data.list[0];
  const aqiInfo = aqiMap[a.main.aqi] || aqiMap[3];
  const c = a.components;

  return {
    city: (location && location.name) || w.name,
    country: (location && location.country) || w.sys?.country,
    temperature: Math.round(w.main.temp),
    feels_like: Math.round(w.main.feels_like),
    humidity: w.main.humidity,
    pressure: w.main.pressure,
    visibility: Math.round((w.visibility || 0) / 1000),
    wind_speed: Math.round(w.wind.speed * 3.6),
    description: w.weather[0].description,
    icon: w.weather[0].icon,
    aqi: {
      value: Math.round(c.pm2_5),
      status: aqiInfo.status,
      statusColor: aqiInfo.color,
      pollutants: [
        { label: "PM2.5", value: `${Math.round(c.pm2_5)} µg/m³`, pct: pct(c.pm2_5, 75) },
        { label: "PM10", value: `${Math.round(c.pm10)} µg/m³`, pct: pct(c.pm10, 150) },
        { label: "O₃", value: `${Math.round(c.o3)} µg/m³`, pct: pct(c.o3, 180) },
        { label: "NO₂", value: `${Math.round(c.no2)} µg/m³`, pct: pct(c.no2, 200) },
      ],
    },
  };
};

// Current location (auto, lat/lon)
router.get("/coords/:lat/:lon", async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const [weatherRes, aqiRes, location] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
      getLocationName(lat, lon),
    ]);

    res.status(200).json(buildResponse(weatherRes, aqiRes, location));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Could not fetch weather data" });
  }
});

// Search by city name
router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const { lat, lon } = weatherRes.data.coord;

    const aqiRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    res.status(200).json(buildResponse(weatherRes, aqiRes));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Could not fetch weather data" });
  }
});

// ---- Forecast helpers (Hourly + 7-Day cards) ----
// Uses OpenWeatherMap's free 5 day / 3-hour forecast endpoint — same API key,
// no extra subscription needed. Note: this only gives ~5 days of data, not 7;
// if you need a true 7-day forecast later, switch this to the One Call 3.0
// endpoint (requires a separate free subscription on OpenWeatherMap's site).

// dt_txt from OpenWeatherMap is a UTC timestamp string. Parsing it with plain
// `new Date(dtTxt)` treats it as the SERVER's local time, not the actual
// location's time — on a server running in a different timezone than the
// city being queried, this silently shows wrong hours (e.g. always looking
// "stuck" at a time that already passed). Fix: shift the true UTC epoch (item.dt)
// by the API's own city.timezone offset (seconds from UTC for that location),
// then read the fields back out as UTC — that gives the correct local wall-clock
// time for that city regardless of what timezone the server itself runs in.
const toLocalDate = (utcSeconds, tzOffsetSec) => new Date((utcSeconds + tzOffsetSec) * 1000);

const formatHour = (utcSeconds, tzOffsetSec) => {
  const d = toLocalDate(utcSeconds, tzOffsetSec);
  return d
    .toLocaleTimeString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" })
    .replace(" ", "");
};

const formatDayLabel = (utcSeconds, tzOffsetSec) => {
  const d = toLocalDate(utcSeconds, tzOffsetSec);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    date: `${d.getUTCDate()} ${d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}`,
    dateKey: d.toISOString().split("T")[0],
    hour: d.getUTCHours(),
  };
};

const buildForecastResponse = (data) => {
  const list = data.list || [];
  const tzOffsetSec = (data.city && data.city.timezone) || 0;

  // OpenWeatherMap's 3-hour slots are timestamped by window START (e.g. "3 PM"
  // covers 3–6 PM). If it's already past that start time, that slot is
  // stale/overlaps with "Now" — skip it and start from the next genuinely
  // upcoming window instead. item.dt is a real UTC epoch, so this comparison
  // against Date.now() is correct no matter what timezone anything runs in.
  const now = Date.now();
  const upcoming = list.filter((item) => item.dt * 1000 > now);

  // Hourly: next 6 slots straight from the 3-hour list, first one labeled "Now"
  const hourly = upcoming.slice(0, 6).map((item, index) => ({
    time: index === 0 ? "Now" : formatHour(item.dt, tzOffsetSec),
    icon: item.weather[0].icon,
    temp: Math.round(item.main.temp),
    precipitation: Math.round((item.pop || 0) * 100),
  }));

  // Weekly: group the 3-hour entries by calendar day (in the CITY's local day, not the server's)
  const days = {};
  list.forEach((item) => {
    const { day, date, dateKey, hour } = formatDayLabel(item.dt, tzOffsetSec);
    if (!days[dateKey]) {
      days[dateKey] = { day, date, temps: [], pops: [], middayIcon: null, middayDiff: Infinity };
    }
    const bucket = days[dateKey];
    bucket.temps.push(item.main.temp);
    bucket.pops.push(item.pop || 0);

    // Pick the icon from the slot closest to local noon as the "representative" icon for the day
    const diff = Math.abs(hour - 12);
    if (diff < bucket.middayDiff) {
      bucket.middayDiff = diff;
      bucket.middayIcon = item.weather[0].icon;
    }
  });

  const weekly = Object.values(days)
    .slice(0, 7)
    .map((bucket) => ({
      day: bucket.day,
      date: bucket.date,
      icon: bucket.middayIcon,
      high: Math.round(Math.max(...bucket.temps)),
      low: Math.round(Math.min(...bucket.temps)),
      precipitation: Math.round(Math.max(...bucket.pops) * 100),
    }));

  return { hourly, weekly };
};

// Hourly + 7-Day forecast (auto location, lat/lon)
router.get("/forecast/coords/:lat/:lon", async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    res.status(200).json(buildForecastResponse(forecastRes.data));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Could not fetch forecast data" });
  }
});

// Hourly + 7-Day forecast (search by city name)
router.get("/forecast/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    res.status(200).json(buildForecastResponse(forecastRes.data));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Could not fetch forecast data" });
  }
});

export default router;