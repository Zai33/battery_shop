import Buyback from "../models/buyBackModel.js";
import { getAllBuyBackService } from "../services/buyBackService.js";

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

export const getBuyBackById = async (req, res) => {
  try {
    const { id } = req.params;
    const buyback = await Buyback.findById(id);
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
