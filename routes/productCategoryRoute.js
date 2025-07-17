import express from "express";
import { adminOnly, protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createProductCategory,
  deleteProductCategory,
  getAllCategories,
} from "../controllers/productCategoryController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/", getAllCategories); //get all category
router.post("/create", adminOnly, createProductCategory); //create category
router.delete("/delete/:id", adminOnly, deleteProductCategory); //delete category

export default router;
