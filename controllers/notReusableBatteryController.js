import e from "express";
import NotReusableBattery from "../models/notReusableBatteryModel.js";

export const getSizeCountsWithTotal = async (req, res) => {
  try {
    const allSizes = [
      "cycle battery",
      "15Ah",
      "20Ah",
      "35Ah",
      "45Ah",
      "50Ah",
      "70Ah",
      "100Ah",
      "120Ah",
      "150Ah",
      "200Ah",
    ];

    // Fetch actual quantities from DB
    const records = await NotReusableBattery.find({}, { size: 1, quantity: 1 });

    // Map to dictionary
    const sizeMap = {};
    for (const record of records) {
      sizeMap[record.size] = record.quantity;
    }

    // Create response with all sizes, even if 0
    const sizeCounts = allSizes.map((size) => ({
      size,
      quantity: sizeMap[size] || 0,
    }));

    // Calculate total quantity
    const totalQuantity = sizeCounts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.status(200).json({
      con: true,
      message: "Size counts fetched successfully",
      sizes: sizeCounts,
      totalQuantity: totalQuantity,
    });
  } catch (error) {
    console.log("Error fetching size counts:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createOrUpdateBatterySize = async (req, res) => {
  try {
    const { size, quantity } = req.body;

    if (!size || !quantity) {
      return res.status(400).json({
        con: false,
        message: "Size and quantity are required",
      });
    }

    // Check if the size already exists
    const battery = await NotReusableBattery.findOne({ size });
    if (battery) {
      battery.quantity += quantity; // Update quantity
      await battery.save(); // Save updated battery
      return res.status(200).json({
        con: true,
        message: "Battery size updated successfully",
        data: battery,
      });
    } else {
      const newBattery = new NotReusableBattery({ size, quantity });
      await newBattery.save(); // Create new battery
      return res.status(201).json({
        con: true,
        message: "Battery size created successfully",
        data: newBattery,
      });
    }
  } catch (error) {
    console.log("Error creating or updating battery size:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteAllBatterySizes = async (req, res) => {
  try {
    await NotReusableBattery.deleteMany({}); // Delete all battery sizes
    res.status(200).json({
      con: true,
      message: "All battery sizes deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting all battery sizes:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
