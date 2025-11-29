import express from "express";
import { GeminiCliController } from "./geminiCli.controller.js";

const router = express.Router();

router.post("/ask", GeminiCliController.createCheckoutSession);


export const geminiCliRoutes = router;
