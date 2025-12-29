import Sale from "../models/saleModel.js";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber.js";

export const createSaleService = async (data, userId, session = null) => {
  const newSale = new Sale({
    ...data,
    createdBy: userId,
  });

  return await newSale.save({ session });
};

export const getAllSalesService = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [sales, total] = await Promise.all([
    Sale.find()
      .populate("customer", "name phone")
      .populate("product", "name price")
      .populate("createdBy", "name email")
      .sort({ saleDate: -1 })
      .skip(skip)
      .limit(limit),

    Sale.countDocuments(),
  ]);

  return { sales, total };
};
