import express from "express"
import { registerUser,Login, userCredit, paymentRazorpay, verifyRazorpay } from "../controllers/userControllers.js";
import { ProctedRoute } from "../middleware/auth.js";

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", Login)
router.get("/credit",ProctedRoute, userCredit);
router.post("/payment",ProctedRoute, paymentRazorpay);
router.post("/verify-payment", verifyRazorpay);

export default router