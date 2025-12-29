import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const SaleCounter = mongoose.model("SaleCounter", counterSchema);
export default SaleCounter;
