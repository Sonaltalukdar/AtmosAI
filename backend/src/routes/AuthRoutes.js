import express from "express";
import { signup, login, getProfile, updateProfile } from "../controllers/AuthController.js";
import protect from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;