import axios from "axios";
import { getWeatherEmoji } from "../utils/weatherIcons.js";

const BASE_URL = "https://atmosai-backend.onrender.com/api/weather";

function formatDate() {
  const today = new Date();

  const datePart = `Today, ${today.getDate()} ${today.toLocaleString(
    "en-US",
    {
      month: "long",
    }
  )}`;

  const timePart = today.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} | ${timePart}`;
}

function mapResponse(data) {
  return {
    location: data.country
      ? `${data.city}, ${data.country}`
      : data.city,

    date: formatDate(),

    updatedAt: Date.now(),

    temp: data.temperature,

    condition: data.description
      .split(" ")
      .map(
        (w) =>
          w.charAt(0).toUpperCase() +
          w.slice(1)
      )
      .join(" "),

    feelsLike: data.feels_like,

    icon: getWeatherEmoji(data.icon),

    humidity: data.humidity,

    windSpeed: data.wind_speed,

    pressure: data.pressure,

    uvIndex: "N/A",

    visibility: data.visibility,

    aqi: data.aqi,
  };
}

export async function getWeatherByCoords(lat, lon) {
  const res = await axios.get(
    `${BASE_URL}/coords/${lat}/${lon}`
  );

  return mapResponse(res.data);
}

export async function getWeatherByCity(city) {
  const res = await axios.get(
    `${BASE_URL}/${encodeURIComponent(city)}`
  );

  return mapResponse(res.data);
}

function mapForecast(data) {
  return {
    hourly: data.hourly.map((h) => ({
      time: h.time,
      icon: getWeatherEmoji(h.icon),
      temp: h.temp,
      precipitation: h.precipitation,
    })),

    weekly: data.weekly.map((d) => ({
      day: d.day,
      date: d.date,
      icon: getWeatherEmoji(d.icon),
      high: d.high,
      low: d.low,
      precipitation: d.precipitation,
    })),
  };
}

export async function getForecastByCoords(lat, lon) {
  const res = await axios.get(
    `${BASE_URL}/forecast/coords/${lat}/${lon}`
  );

  return mapForecast(res.data);
}

export async function getForecastByCity(city) {
  const res = await axios.get(
    `${BASE_URL}/forecast/${encodeURIComponent(city)}`
  );

  return mapForecast(res.data);
}