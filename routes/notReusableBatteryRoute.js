import express from "express";
import {
  protectedRoute,
  roleBasedAccess,
} from "../middlewares/protectedRoute.js";
import {
  createOrUpdateBatterySize,
  deleteAllBatterySizes,
  getSizeCountsWithTotal,
} from "../controllers/notReusableBatteryController.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/size-counts", getSizeCountsWithTotal);
router.post("/create-or-update", createOrUpdateBatterySize);
router.delete("/deleteAll", roleBasedAccess(["admin"]), deleteAllBatterySizes);

export default router;
