import mongoose from "mongoose";

const counterSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const BuybackCounter = mongoose.model("BuybackCounter", counterSchema);
export default BuybackCounter;
