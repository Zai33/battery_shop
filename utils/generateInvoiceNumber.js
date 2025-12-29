import BuybackCounter from "../models/BuybackCounterModel.js";
import SaleCounter from "../models/SaleCounterModel.js";

export const generateInvoiceNumber = async () => {
  const today = new Date();
  const yyyyMMdd = today.toISOString().split("T")[0].replace(/-/g, "");

  const counterId = `INV-${yyyyMMdd}`;

  const counter = await SaleCounter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(3, "0");
  return `INV-${yyyyMMdd}-${padded}`;
};

export const generateBuybackNumber = async () => {
  const today = new Date();
  const yyyyMMdd = today.toISOString().split("T")[0].replace(/-/g, "");

  const counterId = `BB-${yyyyMMdd}`;

  const counter = await BuybackCounter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(3, "0");
  return `BB-${yyyyMMdd}-${padded}`;
};
