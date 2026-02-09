import { getSecondBatteryInfo } from "../services/secondBatteryService.js";

export const secondBatteryInfo = async (req, res) => {
  try {
    const summary = await getSecondBatteryInfo();
    res.status(200).json({
      con: true,
      message: "Second battery info retrieved successfully",
      result: summary,
    });
  } catch (error) {
    console.error("Error retrieving second battery info", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
