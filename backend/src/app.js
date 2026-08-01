import express from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes.js";
import weatherRoutes from "./routes/WeatherRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("AtmosAI Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

export default app;