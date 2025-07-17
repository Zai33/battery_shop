import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
} from "../controllers/customerController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/", getAllCustomers); // Get all customers
router.post("/create", createCustomer); // Create a new customer
router.get("/:id", getCustomerById); // Get customer by ID
router.delete("/delete/:id", adminOnly, deleteCustomer); // Delete a customer by ID
export default router;
