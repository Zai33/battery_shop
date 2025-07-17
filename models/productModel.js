import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Liquid",
        "Maintenance Free",
        "Tubular",
        "LiFePO4",
        "AGM",
        "Gel",
        "Other",
      ],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory", // Make sure you name your category model accordingly
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true, // Example: "12V 100Ah"
    },
    price: {
      type: Number,
      required: true,
    },
    warrantyMonths: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
