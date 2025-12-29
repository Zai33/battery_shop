import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createSale,
  deleteSaleById,
  getAllSales,
  getSaleById,
} from "../controllers/saleController.js";

const router = express.Router();

router.use(protectedRoute); // Apply protected route middleware to all sale routes
router.get("/:id", getSaleById); // Get sale by ID
router.get("/", getAllSales); // Get all sales
router.post("/create", createSale); // Create a new sale
router.delete("/delete/:id", deleteSaleById); // delete sale

export default router;
