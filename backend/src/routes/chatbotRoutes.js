import express from "express";
import { chatWithHerbalAssistant } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/", chatWithHerbalAssistant);

export default router;
