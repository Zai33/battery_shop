import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.use(protectedRoute);

export default router;
