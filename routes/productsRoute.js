import express from "express";
import {
  protectedRoute,
  roleBasedAccess,
} from "../middlewares/protectedRoute.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  updateAllProductFields,
  updatePartialProductFields,
} from "../controllers/productConroller.js";

const router = express.Router();

router.use(protectedRoute); // Apply the protected route middleware to all routes in this router
router.get("/", getAllProducts); //get all products
router.post("/create", createProduct); //create product
router.get("/search", searchProducts); //search products by word
router.get("/:id", getProductById); //get product by id
router.put("/update/:id", roleBasedAccess(["admin"]), updateAllProductFields); //update product
router.patch(
  "/update/:id",
  roleBasedAccess(["admin"]),
  updatePartialProductFields,
); //update product partially
router.delete("/delete/:id", roleBasedAccess(["admin"]), deleteProduct); //delete product
router.get("/category/:categoryId", getProductsByCategory); //get products by category

export default router;
