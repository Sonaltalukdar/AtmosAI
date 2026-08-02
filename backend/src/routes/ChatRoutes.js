import express from "express";
import axios from "axios";
import multer from "multer";
import { createRequire } from "module";
import Groq from "groq-sdk";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });


const systemPrompt = `
You are AtmosAI, an AI-powered Weather Assistant built into the AtmosAI app.

Identity:
- Your name is AtmosAI.
- If someone asks your name, reply:
"I'm AtmosAI, your AI-powered Weather Assistant."
- If someone asks who made/created/built/developed you, reply:
"I was created by Sonal, the developer of the AtmosAI app."
- Never say you are Llama, Meta AI, ChatGPT, Groq or another AI model.

Language style:
- Match the user's language and style based on the actual words used, not just the length of the message.
- If the user writes in English (including short greetings like "hey", "hi", "hello", "yo"), reply in English.
- If the user writes in Benglish (Bengali words spelled out in Roman/English letters, e.g. "ki obostha", "kemon acho", "ajke ki weather"), reply back in natural, casual Benglish.
- Do not guess Benglish just because a message is short. "hey" and "hi" are English words — treat them as English, not Benglish.
- If the message is genuinely ambiguous (e.g. just "ok" or "hmm"), default to English.
- The user's language can change message to message — always match the CURRENT message's language, not the previous one.
- Reply in natural, casual Benglish — the way a real Bengali person actually texts a friend, NOT a stiff or robotic pattern.
- Do NOT force weather talk into every reply just because you're a weather assistant. If the user says "kamon acho?" just reply casually like a person would ("Bhalo achi, tumi kemon acho?") — don't awkwardly redirect every message to weather.
- Vary your sentence structure — don't repeat the same phrase ("ajke weather ki obostha?") in almost every reply. Real conversation doesn't sound like a template.
- Keep numbers/technical terms (temperature, humidity, AQI, °C, km/h) in English since that's how Bengalis normally say them too — don't translate them.
- Do not switch to native Bengali script (bangla অক্ষর) — always keep it in Roman/English letters.

Examples (for reference only, don't copy verbatim):
User: "hey"
You: "Hey! How can I help you today?"

User: "hi"
You: "Hi there! What can I do for you?"

User: "kamon acho?"
You: "Ei to bhalo achi! Tumi bolo, ki obostha tomar dik theke?"

User: "ajke ki brishti hobe?"
You: "Dekhi, ekhon je condition dekhte pacchi tate brishti-r chance ache. Umbrella niye berio."

IMPORTANT: If the user asks what you know, don't know, or what you can/cannot do,
you MUST answer using ONLY the exact list below. Do NOT add generic AI disclaimers
like "I don't know real-time weather unless provided" — that is WRONG. You DO have
access to real-time weather data through the app whenever the user asks about a
specific city or place, or asks about their current location.

What you CAN do (say this confidently, not as a limitation):
- Give current, real, live weather conditions (temperature, feels-like, humidity, wind speed, condition) for the user's exact current location (using precise GPS coordinates), or for any named city, fetched fresh from the app's weather service.
- Give forecasts up to 5 days ahead.
- Explain weather concepts (AQI, humidity, wind patterns, storms, seasons, etc).
- Give practical advice based on current conditions (e.g. "carry an umbrella", "stay hydrated").
- Read and understand images and documents (PDF/text) the user uploads, and answer questions about them.

What you CANNOT do (mention only if directly relevant):
- Forecasts beyond 5 days, with full confidence.
- Personal experiences or feelings.
- If the live weather service specifically fails for a request, say so honestly instead of guessing.

Rules:
- Use real weather data whenever it is provided to you in the prompt — never invent live weather numbers on your own.
- Keep answers friendly, short, and natural — avoid long bullet-point lists unless the user specifically asks for a breakdown.
- When asked "what can/can't you do" or "what do you know/not know", answer directly from the two lists above — do not fall back on generic AI limitations language.
`;


router.post("/", upload.single("file"), async (req, res) => {

  try {

    const message = req.body.message;

    console.log("Received message:", message);
    console.log("Received file:", req.file ? {
      name: req.file.originalname,
      mime: req.file.mimetype,
      size: req.file.size,
    } : "NO FILE RECEIVED");

    let history = [];
    let location = null;

    try {
      if (req.body.history) history = JSON.parse(req.body.history);
    } catch {
      history = [];
    }

    try {
      if (req.body.location) location = JSON.parse(req.body.location);
    } catch {
      location = null;
    }

    if (!message && !req.file) {
      return res.status(400).json({ message: "Message is required" });
    }

    let prompt = message || "Please describe/analyze the attached file.";

    let imageDataUrl = null;

    if (req.file) {
      const mime = req.file.mimetype;

      if (mime.startsWith("image/")) {
        const base64 = req.file.buffer.toString("base64");
        imageDataUrl = `data:${mime};base64,${base64}`;

      } else if (mime === "application/pdf") {
        try {
          const parser = new PDFParse({ data: req.file.buffer });
          const result = await parser.getText();

          prompt = `

Document Content (from uploaded PDF "${req.file.originalname}"):

${result.text.slice(0, 8000)}

User Question:

${message || "Summarize this document."}

Answer based on the document content above.
`;
        } catch (err) {
          console.error("PDF parse error:", err.message);
          prompt = `The uploaded PDF could not be read. User asked: ${message || ""}`;
        }

      } else if (mime === "text/plain") {
        const textContent = req.file.buffer.toString("utf-8");
        prompt = `

Document Content (from uploaded file "${req.file.originalname}"):

${textContent.slice(0, 8000)}

User Question:

${message || "Summarize this document."}

Answer based on the document content above.
`;
      }
    }

    const weatherWords = [
      "weather", "temperature", "temp", "humidity",
      "wind", "rain", "forecast", "climate", "aqi",
    ];

    const isWeatherQuery =
      !req.file &&
      message &&
      weatherWords.some((word) => message.toLowerCase().includes(word));

    if (isWeatherQuery) {

      if (location && location.lat && location.lon) {
        try {
          const weatherResponse = await axios.get(
            `https://atmosai-backend.onrender.com/api/weather/coords/${location.lat}/${location.lon}`
          );
          const weather = weatherResponse.data;

          prompt = `

Real Weather Data (user's current precise location):

City: ${weather.city}
Temperature: ${weather.temperature}°C
Feels Like: ${weather.feels_like}°C
Humidity: ${weather.humidity}%
Wind Speed: ${weather.wind_speed} m/s
Condition: ${weather.description}
Air Quality Index (AQI): ${weather.aqi.value} (${weather.aqi.status})
Pollutants — PM2.5: ${weather.aqi.pollutants[0].value}, PM10: ${weather.aqi.pollutants[1].value}, O3: ${weather.aqi.pollutants[2].value}, NO2: ${weather.aqi.pollutants[3].value}

User Question:

${message}

Answer naturally using only this real weather data. Mention it reflects
their current location if relevant. Do not create fake weather information.
`;
        } catch (error) {
          prompt = `The live weather service is currently unavailable. User asked: ${message}. Politely tell the user that live weather data is unavailable.`;
        }

      } else {

        let city = null;
        const cityMatch = message.match(
          /(?:in|at|for)\s+([a-zA-Z\s]+)|^([a-zA-Z\s]+)\s+(weather|temperature|forecast|climate)/i
        );
        if (cityMatch) city = (cityMatch[1] || cityMatch[2]).trim();
        if (!city) city = "Kolkata";

        try {
          const weatherResponse = await axios.get(
            `https://atmosai-backend.onrender.com/api/weather/${encodeURIComponent(city)}`
          );
          const weather = weatherResponse.data;

          prompt = `

Real Weather Data:

City: ${weather.city}
Temperature: ${weather.temperature}°C
Feels Like: ${weather.feels_like}°C
Humidity: ${weather.humidity}%
Wind Speed: ${weather.wind_speed} m/s
Condition: ${weather.description}
Air Quality Index (AQI): ${weather.aqi.value} (${weather.aqi.status})
Pollutants — PM2.5: ${weather.aqi.pollutants[0].value}, PM10: ${weather.aqi.pollutants[1].value}, O3: ${weather.aqi.pollutants[2].value}, NO2: ${weather.aqi.pollutants[3].value}

User Question:

${message}

Answer naturally using only this real weather data.
Do not create fake weather information.
`;
        } catch (error) {
          prompt = `The live weather service is currently unavailable. User asked: ${message}. Politely tell the user that live weather data is unavailable.`;
        }
      }
    }

    const userContent = imageDataUrl
      ? [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ]
      : prompt;

    const modelToUse = imageDataUrl
      ? "qwen/qwen3.6-27b"
      : "openai/gpt-oss-120b";

    const completion = await groq.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userContent },
      ],
    });

    let reply = completion.choices[0].message.content;

    reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not get AI response" });
  }
});


export default router;