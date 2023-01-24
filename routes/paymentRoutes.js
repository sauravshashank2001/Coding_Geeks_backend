import express from "express";
import { buySubscription } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.get("/subscribe",isAuthenticated,buySubscription);

export default router;