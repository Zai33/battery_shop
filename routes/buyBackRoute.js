import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  getAllBuyBacks,
  getBuyBackById,
} from "../controllers/buyBackController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/", getAllBuyBacks); // Get all buy-backs
router.get("/:id", getBuyBackById); // Get buy-back by ID

export default router;
