import express from "express";
import {
  checkAuth,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resendOpt,
  verifyUser,
} from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/verify-otp", verifyUser);
router.post("/register/resend-otp", resendOpt);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/get-me", protectedRoute, getUserProfile);
router.get("/check", checkAuth);

export default router;
