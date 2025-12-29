import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createBuyBack,
  deleteBuyBackById,
  getAllBuyBacks,
  getBuyBackById,
  verifyBuyBack,
} from "../controllers/buyBackController.js";

const router = express.Router();

// router.use(protectedRoute);
router.get("/", protectedRoute, getAllBuyBacks); // Get all buy-backs
router.get("/:id", protectedRoute, getBuyBackById); // Get buy-back by ID
router.post("/create", protectedRoute, createBuyBack); //create buyback
router.delete("/delete/:id", protectedRoute, adminOnly, deleteBuyBackById); //delete buy-back by ID
router.get("/verify/:id", verifyBuyBack); //verify buyback

export default router;
