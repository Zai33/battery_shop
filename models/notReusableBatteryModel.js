import mongoose from "mongoose";

const notReusableBatterySchema = new mongoose.Schema(
  {
    size: {
      type: String,
      enum: [
        "cycle battery",
        "N15",
        "N35",
        "N20",
        "N45",
        "N50",
        "N70",
        "N100",
        "N120",
        "N150",
        "N200",
      ],
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Automatically update `lastUpdated` before save
notReusableBatterySchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const NotReusableBattery = mongoose.model(
  "NotReusableBattery",
  notReusableBatterySchema
);
export default NotReusableBattery;
