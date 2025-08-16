import Sale from "../models/saleModel.js";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber.js";

export const createSaleService = async (data, userId, session = null) => {
  const invoiceNumber = await generateInvoiceNumber();

  const newSale = new Sale({
    ...data,
    invoiceNumber,
    createdBy: userId,
  });

  return await newSale.save({ session });
};

export const getAllSalesService = async () => {
  return await Sale.find()
    .populate("customer", "name phone")
    .populate("product", "name price")
    .populate("createdBy", "name email")
    .sort({ saleDate: -1 });
};
