import express from "express";
import {
  protectedRoute,
  roleBasedAccess,
} from "../middlewares/protectedRoute.js";
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
router.post("/create", roleBasedAccess(["admin"]), createSupplier); // Create a new supplier
router.put("/update/:id", roleBasedAccess(["admin"]), updateSupplier); // Update a supplier by ID
router.delete("/delete/:id", roleBasedAccess(["admin"]), deleteSupplier); // Delete a supplier by ID

export default router;
