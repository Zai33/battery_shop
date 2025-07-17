import mongoose from "mongoose";

const notReusableBatterySchema = new mongoose.Schema(
  {
    size: {
      type: String,
      enum: [
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
