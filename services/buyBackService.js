import Buyback from "../models/buyBackModel.js";

export const getAllBuyBackService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [buybacks, totalCount] = await Promise.all([
    Buyback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

    Buyback.countDocuments(),
  ]);
  return { buybacks, totalCount };
};
