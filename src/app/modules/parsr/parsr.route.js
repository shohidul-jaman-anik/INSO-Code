import express from "express";
import { ParsrController } from "./parsr.controller.js";

const router = express.Router();

router.post("/parse", ParsrController.parseDocument);

export const parsrRoutes = router;