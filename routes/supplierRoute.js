import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createSupplier,
  deleteSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/", getAllSupplier); // Get all suppliers
router.get("/:id", getSupplierById); // Get a supplier by ID
router.post("/create", adminOnly, createSupplier); // Create a new supplier
router.put("/update/:id", adminOnly, updateSupplier); // Update a supplier by ID
router.delete("/delete/:id", adminOnly, deleteSupplier); // Delete a supplier by ID

export default router;
