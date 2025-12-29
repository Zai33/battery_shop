import mongoose from "mongoose";

const SecondBatteryPriceSchema = mongoose.Schema(
  {
    capactiy: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    effectiveFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },
    effectiveTo: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SecondBatteryPrice = mongoose.model(
  "SecondBatteryPrice",
  SecondBatteryPriceSchema
);
export default SecondBatteryPrice;
