import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateAllProductFields,
  updatePartialProductFields,
} from "../controllers/productConroller.js";

const router = express.Router();

router.use(protectedRoute); // Apply the protected route middleware to all routes in this router
router.get("/", getAllProducts); //get all products
router.post("/create", createProduct); //create product
router.get("/:id", getProductById); //get product by id
router.put("/update/:id", adminOnly, updateAllProductFields); //update product
router.patch("/update/:id", adminOnly, updatePartialProductFields); //update product partially
router.delete("/delete/:id", adminOnly, deleteProduct); //delete product
router.get("/category/:categoryId", getProductsByCategory); //get products by category

export default router;
