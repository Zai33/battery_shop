import mongoose from "mongoose";

const batteryDetailSchema = new mongoose.Schema(
  {
    batterySize: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
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
  },
  { _id: false } // Avoid unnecessary ObjectId for subdocuments
);

const buybackSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    batteries: {
      type: [batteryDetailSchema],
      required: true,
      validate: [
        (arr) => arr.length > 0,
        "At least one battery detail is required",
      ],
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
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      default: null, // because some buybacks might be standalone
    },
  },
  { timestamps: true }
);

const Buyback = mongoose.model("Buyback", buybackSchema);
export default Buyback;
