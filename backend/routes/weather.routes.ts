import { Router } from "express";
import { findWeather, getSuggestions } from "../controllers/weather.controllers";

const router = Router();

router.get("/search", findWeather);
router.get("/suggestions", getSuggestions);

export default router;