import express from "express"
import { ProctedRoute } from "../middleware/auth.js";
import { generateImage } from "../controllers/imageController.js";

const router = express.Router()

router.post("/generate-image", ProctedRoute, generateImage);

export default router;