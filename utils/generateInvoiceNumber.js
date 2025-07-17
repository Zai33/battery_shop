import Sale from "../models/saleModel.js";

export const generateInvoiceNumber = async () => {
  const today = new Date();
  const yyyyMMdd = today.toISOString().split("T")[0].replace(/-/g, ""); 

  // Get start and end of today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Count how many invoices exist today
  const countToday = await Sale.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const counter = String(countToday + 1).padStart(3, "0"); 
  return `INV-${yyyyMMdd}-${counter}`;
};
