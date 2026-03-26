import { getSecondBatteryInfo } from "../services/secondBatteryService.js";

export const secondBatteryInfo = async (req, res, next) => {
  try {
    const summary = await getSecondBatteryInfo();
    res.status(200).json({
      con: true,
      message: "Second battery info retrieved successfully",
      result: summary,
    });
  } catch (error) {
    return next(error);
  }
};
