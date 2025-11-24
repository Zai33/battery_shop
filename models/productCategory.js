import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Car",
        "Solar",
        "Inverter",
        "UPS",
        "Motorcycle", 
        "Electric bike",
        "Other",
      ],
      required: true,
      unique: true, 
      trim: true,
    },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);
export default ProductCategory;
