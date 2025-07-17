import mongoose from "mongoose";

const buybackSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    batteryType: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
    inspectionNote: {
      type: String,
      trim: true,
    },
    reused: {
      type: Boolean,
      required: true,
    },
    buyDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Buyback = mongoose.model("Buyback", buybackSchema);
export default Buyback;
