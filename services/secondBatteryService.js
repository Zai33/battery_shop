import SecondBattery from "../models/secondBatteryModel.js";

export const getSecondBatteryInfo = async () => {
  const result = await SecondBattery.aggregate([
    {
      $group: {
        _id: "$capacity",
        quantity: { $sum: "$quantity" },
      },
    },
    {
      $facet: {
        byCapacity: [{ $sort: { capacity: 1 } }],
        total: [
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: "$quantity" },
            },
          },
        ],
      },
    },
    {
      $project: {
        byCapacity: 1,
        totalQuantity: {
          $ifNull: [{ $arrayElemAt: ["$total.totalQuantity", 0] }, 0],
        },
      },
    },
  ]);
  return result[0];
};
