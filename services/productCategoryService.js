import ProductCategory from "../models/productCategory.js";

export const getAllProductCategoriesService = async () => {
  try {
    return await ProductCategory.find().sort({ createdAt: 1 });
  } catch (error) {
    console.log("Error in getAllProductCategoriesService:", error);
    throw new Error("Internal server error");
  }
};
