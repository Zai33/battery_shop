import express from "express";
import {
  protectedRoute,
  roleBasedAccess,
} from "../middlewares/protectedRoute.js";
import {
  createProductCategory,
  deleteProductCategory,
  getAllCategories,
} from "../controllers/productCategoryController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/", getAllCategories); //get all category
router.post("/create", roleBasedAccess(["admin"]), createProductCategory); //create category
router.delete("/delete/:id", roleBasedAccess(["admin"]), deleteProductCategory); //delete category

export default router;
