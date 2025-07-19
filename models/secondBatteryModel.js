import mongoose from "mongoose";

const secondBatterySchema = new mongoose.Schema(
  {
    buyback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyback", // if you have a buyback collection
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    warrantyMonths: {
      type: Number,
      default: 3, // 3-month warranty for second batteries
      min: 0,
    },
    condition: {
      type: String,
      enum: ["Good", "Fair", "Poor"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

const SecondBattery = mongoose.model("SecondBattery", secondBatterySchema);

export default SecondBattery;
