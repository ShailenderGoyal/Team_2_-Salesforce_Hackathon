import express from "express"
const router=express.Router();
import {analyzeParameterSimple } from "../controllers/ai.controller.js";
// router.post("/summarize",handleSummary);
router.post("/analyze",analyzeParameterSimple);

export default router