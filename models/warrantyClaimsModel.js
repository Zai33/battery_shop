import mongoose from "mongoose";

const warrantyClaimSchema = new mongoose.Schema(
  {
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    issueReported: {
      type: String,
      required: true,
      trim: true,
    },
    resolved: {
      type: Boolean,
      required: true,
      default: false,
    },
    resolutionNote: {
      type: String,
      trim: true,
      default: "",
    },
    claimDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    resolvedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const WarrantyClaim = mongoose.model("WarrantyClaim", warrantyClaimSchema);
export default WarrantyClaim;
