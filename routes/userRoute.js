import express from "express";
import { editUser, updateUserImage } from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.patch("/edit-profile/:id", protectedRoute, editUser);
router.patch("/edit-profile-image/:id",protectedRoute,upload.single("image"),updateUserImage);

export default router;
