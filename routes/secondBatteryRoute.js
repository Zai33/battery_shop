import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { secondBatteryInfo } from "../controllers/SecondBatteryController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/info", secondBatteryInfo); // second battery info

export default router;
