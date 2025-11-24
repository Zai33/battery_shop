import Product from "../models/productModel.js";
import {
  createProductService,
  getAllProductsService,
  getProductsByCategoryService,
} from "../services/productService.js";

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { products, totalCount } = await getAllProductsService(page, limit);
    const totalPages = Math.ceil(totalCount / limit);
    if (!products || products.length === 0) {
      return res.status(404).json({
        con: true,
        message: "No products found",
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        result: [],
      });
    }
    res.status(200).json({
      con: true,
      message: "Products fetched successfully",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      result: products,
    });
  } catch (error) {
    console.log("Error fetching products:", error);
    res.status(500).json({
      con: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

//get product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Product fetched successfully",
      result: product,
    });
  } catch (error) {
    console.log("Error fetching product: ", error);
    res.status(500).json({
      con: false,
      message: "Failed to fetch product",
      error: error.message,
    }); 
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      supplier,
      brand,
      capacity,
      price,
      warrantyMonths,
      quantity,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !type ||
      !category ||
      !supplier ||
      !brand ||
      !capacity ||
      !price ||
      !warrantyMonths
    ) {
      return res.status(400).json({
        con: false,
        message: "All required fields must be filled",
      });
    }

    const productData = {
      name,
      type,
      category,
      supplier,
      brand,
      capacity,
      price,
      warrantyMonths,
      quantity,
    };

    const newProduct = await createProductService(productData);
    res.status(201).json({
      con: true,
      message: "Product created successfully",
      result: newProduct,
    });
  } catch (error) {
    console.log("Error creating product:", error);
    res.status(500).json({
      con: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const updateAllProductFields = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      category,
      supplier,
      brand,
      capacity,
      price,
      warrantyMonths,
      quantity,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !type ||
      !category ||
      !supplier ||
      !brand ||
      !capacity ||
      !price ||
      !warrantyMonths ||
      quantity === undefined
    ) {
      return res.status(400).json({
        con: false,
        message: "All fields are required for full update",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        type,
        category,
        supplier,
        brand,
        capacity,
        price,
        warrantyMonths,
        quantity,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      con: true,
      message: "Product fully updated successfully",
      result: updatedProduct,
    });
  } catch (error) {
    console.log("Error updating product:", error);
    res.status(500).json({
      con: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const updatePartialProductFields = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        con: false,
        message: "At least one field is required for update",
        s,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      con: true,
      message: "Product successfully updated",
      result: updatedProduct,
    });
  } catch (error) {
    console.log("Error updating product:", error);
    res.status(500).json({
      con: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting product:", error);
    res.status(500).json({
      con: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

//get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!categoryId) {
      return res.status(400).json({
        con: false,
        message: "Category ID is required",
      });
    }

    const { products, totalCount, currentPage, totalPages } =
      await getProductsByCategoryService(categoryId, page, limit);

    res.status(200).json({
      con: true,
      message: "Products fetched successfully by category",
      currentPage,
      totalPages,
      totalProducts: totalCount,
      count: products.length,
      result: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      con: false,
      message: "Server error",
      error: error.message,
    });
  }
};
