import mongoose from "mongoose";
import Buyback from "../models/buyBackModel.js";
import Customer from "../models/customerMode.js";
import { generateBuybackNumber } from "../utils/generateInvoiceNumber.js";
import SecondBattery from "../models/secondBatteryModel.js";
import NotReusableBattery from "../models/notReusableBatteryModel.js";

export const getAllBuyBackService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [buybacks, totalCount] = await Promise.all([
    Buyback.find()
      .populate("customer", "name phone")
      .populate("createdBy", "name")
      .populate("sale", "invoiceNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Buyback.countDocuments(),
  ]);
  return { buybacks, totalCount };
};

export const createStandaloneBuyBack = async (payload, userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { customerInfo, buybackData } = payload;

    //simple validation
    if (
      !customerInfo ||
      !Array.isArray(buybackData) ||
      buybackData.length === 0
    ) {
      throw new Error("INVALID_INPUT");
    }
    const buybackNumber = await generateBuybackNumber();

    //find or create customer
    let customer = await Customer.findOne({
      phone: customerInfo.phone,
    }).session(session);

    if (!customer) {
      customer = await new Customer(customerInfo).save({ session });
    }

    const batteries = buybackData.map((item) => ({
      batterySize: item.batterySize,
      quantity: item.quantity,
      buyPrice: item.buyPrice,
      total: item.quantity * item.buyPrice,
      reused: item.reused ?? false,
    }));

    const buyback = new Buyback({
      buybackNumber,
      customer: customer._id,
      batteries,
      createdBy: userId,
    });

    await buyback.save({ session });

    await session.commitTransaction();
    session.endSession();

    return buyback;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const rollbackInventory = async (buyback, session) => {
  for (const item of buyback.batteries) {
    if (item.reused) {
      // rollback second battery
      await SecondBattery.updateOne(
        { capacity: item.batterySize },
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    } else {
      // rollback not reusable
      await NotReusableBattery.updateOne(
        { size: item.batterySize },
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }
  }
};

export const applyInventory = async (batteries, session) => {
  for (const item of batteries) {
    if (item.reused) {
      await SecondBattery.findOneAndUpdate(
        { capacity: item.batterySize },
        { $inc: { quantity: item.quantity } },
        { upsert: true, new: true, session }
      );
    } else {
      await NotReusableBattery.findOneAndUpdate(
        { size: item.batterySize },
        { $inc: { quantity: item.quantity } },
        { upsert: true, new: true, session }
      );
    }
  }
};
