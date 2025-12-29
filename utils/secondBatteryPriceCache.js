import SecondBatteryPrice from "../models/SecondBatteryPriceModel.js";

let priceCache = new Map();

export const loadSecondBatteryPriceCache = async () => {
  const prices = await SecondBatteryPrice.find({
    effectiveTo: null,
  });
  priceCache.clear();
  prices.forEach((p) => {
    priceCache.set(p.capactiy, p.price);
  });
};

export const getCachedPrice = (capacity) => {
  return priceCache.get(capacity);
};
