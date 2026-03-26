import ProductCategory from "../models/productCategory.js";
import { getAllProductCategoriesService } from "../services/productCategoryService.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllProductCategoriesService();
    res.status(200).json({
      con: true,
      message: "Product categories retrieved successfully",
      result: categories,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProductCategory = async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({
        con: false,
        message: "Product category type is required",
      });
    }
    const existingCategory = await ProductCategory.findOne({ type });
    if (existingCategory) {
      return res.status(400).json({
        con: false,
        message: "Product category type is already set",
      });
    }

    const newCategory = new ProductCategory({ type });
    await newCategory.save();

    res.status(200).json({
      con: true,
      message: "New product category is successfully created",
      result: newCategory,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProductCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await ProductCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({
        con: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
