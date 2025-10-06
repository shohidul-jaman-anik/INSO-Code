import express from "express";
import { OpenSWEController } from "./openswe.controller.js";

const router = express.Router();

router.post("/analyze", OpenSWEController.analyze);
router.post("/apply-change", OpenSWEController.applyChange);

export const openSWERoutes = router;
