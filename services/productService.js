import Product from "../models/productModel.js";

export const getAllProductsService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [products, totalCount] = await Promise.all([
    Product.find()
      .populate("category", "type")
      .populate("supplier", "companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(),
  ]);
  return { products, totalCount };
};

export const createProductService = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

export const getProductsByCategoryService = async (
  categoryId,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find({ category: categoryId })
      .populate("category", "type")
      .populate("supplier", "companyName")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Product.countDocuments({ category: categoryId }),
  ]);

  return {
    products,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  };
};
