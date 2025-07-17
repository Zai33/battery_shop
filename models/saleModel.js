import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batteryCategory: {
      type: String,
      enum: ["new", "second"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    oldBatteryPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },  
    rebuyOldBattery: {
      type: Boolean,
      required: true,
      default: false,
    },
    buyback: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyback",
      },
    ],
    saleDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    warrantyExpiry: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Credit"],
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    changeGiven: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", salesSchema);
export default Sale;
