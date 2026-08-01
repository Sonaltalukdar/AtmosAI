import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await resend.emails.send({
      from: "AtmosAI Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `New message from ${name} (AtmosAI Contact Form)`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;