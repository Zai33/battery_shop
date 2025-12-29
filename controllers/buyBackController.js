import mongoose from "mongoose";
import Buyback from "../models/buyBackModel.js";
import {
  applyInventory,
  createStandaloneBuyBack,
  getAllBuyBackService,
  rollbackInventory,
} from "../services/buyBackService.js";
import Sale from "../models/saleModel.js";

//get all buybacks
export const getAllBuyBacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { buybacks, totalCount } = await getAllBuyBackService(page, limit);
    const totalPages = Math.ceil(totalCount / limit);
    if (!buybacks || buybacks.length === 0) {
      return res.status(404).json({
        con: true,
        message: "No buybacks found",
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        result: [],
      });
    }
    res.status(200).json({
      con: true,
      message: "Buybacks fetched successfully",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      result: buybacks,
    });
  } catch (error) {
    console.log("Error fetching buybacks:", error);
    res.status(500).json({
      con: false,
      message: "Failed to fetch buybacks",
      error: error.message,
    });
  }
};

//get buyback by id
export const getBuyBackById = async (req, res) => {
  try {
    const { id } = req.params;
    const buyback = await Buyback.findById(id)
      .populate("customer", "name phone")
      .populate("createdBy", "name")
      .populate("sale", "invoiceNumber");
    if (!buyback) {
      return res.status(404).json({
        con: false,
        message: "Buyback not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Buyback fetched successfully",
      result: buyback,
    });
  } catch (error) {
    console.log("Error fetching buyback: ", error);
    res.status(500).json({
      con: false,
      message: "Failed to fetch buyback",
      error: error.message,
    });
  }
};

//delete buyback by id
export const deleteBuyBackById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    session.startTransaction();

    const buyback = await Buyback.findById(id).session(session);
    if (!buyback) {
      await session.abortTransaction();
      return res.status(404).json({
        con: false,
        message: "BuyBack Not Found",
      });
    }

    if (buyback.sale) {
      await Sale.findByIdAndUpdate(
        buyback.sale,
        { $pull: { buyback: buyback._id } },
        { session }
      );
    }

    await Buyback.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      con: true,
      message: "BuyBack Delete Successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Error Deleting BuyBack: ", error);
    res.status(500).json({
      con: false,
      message: "Failed to Delete BuyBack",
      error: error.message,
    });
  }
};

//create stand-alone buyback
export const createBuyBack = async (req, res) => {
  try {
    const buyback = await createStandaloneBuyBack(req.body, req.user._id);

    return res.status(201).json({
      con: true,
      message: "BuyBack create successfully",
      result: buyback,
    });
  } catch (error) {
    if (error.message === "INVALID_INPUT") {
      return res.status(400).json({
        con: false,
        message: "Invalid input data",
      });
    }

    return res.status(500).json({
      con: false,
      message: "Internal server error",
    });
  }
};

//verify buyback
export const verifyBuyBack = async (req, res) => {
  try {
    const { id } = req.params;
    const buyback = await Buyback.findById(id)
      .populate("customer", "name phone")
      .populate("sale", "invoiceNumber");

    if (!buyback) {
      return res.status(404).json({
        valid: false,
        message: "Invalid or fake voucher",
      });
    }

    return res.status(200).json({
      valid: true,
      buybackNumber: buyback.buybackNumber,
      customer: buyback.customer,
      date: buyback.buyDate,
      total: buyback.batteries.reduce((s, b) => s + b.total, 0),
      saleInvoice: buyback.sale?.invoiceNumber || null,
      status: buyback.sale ? "USED_IN_SALE" : "STANDALONE",
    });
  } catch (error) {
    console.log("Verification failed :", error);
    res.status(500).json({
      valid: false,
      message: "Verification failed",
    });
  }
};

//update buyback
export const updateBuyBack = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;
    const updates = req.body;

    const buyback = await Buyback.findById(id).session(session);
    if (!buyback) {
      throw new Error("BUYBACK_NOT_FOUND");
    }

    await rollbackInventory(buyback, session);

    buyback.batteries = updates.batteries ?? buyback.batteries;
    buyback.createdBy = req.user._id;

    await buyback.save({ session });

    await applyInventory(buyback.batteries, session);

    await session.commitTransaction();
    res.status(200).json({
      con: true,
      message: "update buyback Successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      con: false,
      message: "Failed to update buyback",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
