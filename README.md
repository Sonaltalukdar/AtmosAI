# AtmosAI 🌤️

AtmosAI is a premium, AI-powered weather forecast web application featuring a glassmorphism-inspired design, real-time weather data, an interactive weather map, and a conversational AI assistant. Built as a full-stack MERN project with a focus on polished UI/UX, AtmosAI blends the clean aesthetics of Apple Weather with the bold, minimal feel of Nothing OS.

---

## ✨ Features

- Real-Time Weather Data — Current conditions, air quality, hourly and weekly forecasts powered by the OpenWeather API.
- AI Weather Assistant — A full-page conversational chat assistant (powered by Groq's LLaMA 3.3 70B) for natural-language weather queries and advice.
- Interactive Weather Map — A Leaflet-based map with layer toggles, location search, and marker-based location info cards.
- Favourites — Save and manage frequently checked locations for quick access.
- User Authentication — Secure signup/login with JWT-based sessions and bcrypt password hashing.
- User Profile — View and manage account details.
- Contact Form — Backend-integrated contact/support route with email delivery.
- Dynamic Weather-Reactive Themes — Animated backgrounds (sunny, cloudy, rain, thunderstorm, and more) that shift based on live conditions.
- Responsive Glassmorphism UI — Frosted-glass cards, smooth animations, and a fully responsive layout across devices.

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- Leaflet / React-Leaflet (interactive maps)
- Lucide React (icons)
- React Circular Progressbar (air quality visualization)

### Backend
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken) + bcryptjs (authentication)
- Groq SDK (AI assistant, LLaMA 3.3 70B Versatile)
- Nodemailer (contact form emails)
- Multer, pdf-parse (file handling utilities)
- CORS, dotenv

---

## 📁 Project Structure

```
AtmosAI/
├── backend/
│   ├── src/
│   │   ├── config/           # Database connection setup
│   │   ├── controllers/      # Route logic (Auth, etc.)
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # Mongoose schemas (User)
│   │   ├── routes/           # Express routes (Auth, Weather, Chat, Contact)
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AIChat/        # AI assistant chat UI
    │   │   ├── Auth/          # Login/Signup modal
    │   │   ├── Favourites/    # Favourite location cards
    │   │   ├── Footer/
    │   │   ├── Home/          # Weather card, air quality, forecasts
    │   │   ├── Navbar/        # Navbar + searchbar
    │   │   ├── Weather/       # Weather-reactive background & themes
    │   │   └── WeatherMap/    # Map, markers, legend, layer toggle
    │   ├── Context/           # Global weather state (WeatherContext)
    │   ├── data/              # Static location data
    │   ├── pages/             # Welcome, Home, AI Assistant, Weather Map,
    │   │                      # Favourites, Contact, Profile
    │   ├── services/          # API clients (auth, weather, geolocation)
    │   ├── styles/            # Global styles & animations
    │   └── utils/             # Helper utilities (weather icons)
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- A MongoDB Atlas connection string
- An [OpenWeather](https://openweathermap.org/api) API key
- A [Groq](https://console.groq.com/) API key

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/AtmosAI.git
cd AtmosAI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (this file is gitignored and should never be committed) with your own MongoDB URI, JWT secret, API keys, and email credentials required by the app.

Run the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` (also gitignored) with your OpenWeather API key.

Run the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

---

## 🔌 API Overview

| Route              | Description                               |
|---------------------|--------------------------------------------|
| `/api/auth`         | Signup, login, and user profile endpoints  |
| `/api/weather`       | Weather data retrieval (OpenWeather proxy) |
| `/api/chat`         | AI assistant chat (Groq LLaMA 3.3 70B)     |
| `/api/contact`      | Contact form submission & email delivery    |

---

## 🗺️ Roadmap

- [ ] Theme toggle (light/dark mode) functionality
- [ ] Weekly forecast chart visualizations
- [ ] Reusable UI component library (Button, Modal, Input, GlassCard)
- [ ] Loader/skeleton states across data-fetching components

---

## 👤 Author

GitHub: [Sonaltalukdar/AtmosAI](https://github.com/Sonaltalukdar/AtmosAI)

---

## 📄 License

This project is licensed under the ISC License.