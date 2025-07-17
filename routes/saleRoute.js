import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import { createSale, getAllSales } from "../controllers/saleController.js";

const router = express.Router();

router.use(protectedRoute); // Apply protected route middleware to all sale routes
router.get("/", adminOnly, getAllSales); // Get all sales
router.post("/create", createSale); // Create a new sale

export default router;
