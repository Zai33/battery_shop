import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { generateOpt, sendOptEmail } from "../utils/otpService.js";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        con: false,
        message: "Invalid email format",
      });
    }

    // Validate required fields
    if (!email || !password || !confirmPassword || !name) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        con: false,
        message: "Email already exists",
      });
    }

    //check if user name already exists
    const existingUserName = await User.findOne({ name });
    if (existingUserName) {
      return res.status(400).json({
        con: false,
        message: "User name already exists",
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        con: false,
        message: "Passwords do not match",
      });
    }

    //check password length
    if (password.length < 6) {
      return res.status(400).json({
        con: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //opt seding
    const plainOtp = generateOpt();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(plainOtp)
      .digest("hex");

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpire: Date.now() + 60 * 1000,
      isverified: false,
    });

    await sendOptEmail(email, plainOtp);
    res.status(201).json({
      con: true,
      message:
        "Registration initiated. An OTP has been sent to your e-mail and is valid for 1 minute.",
      userId: newUser._id,
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({
        con: false,
        message: "Please provide userId and otp",
      });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }
    if (user.isverified) {
      return res.status(400).json({
        con: false,
        message: "User already verified",
      });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        con: false,
        message: "OTP not found or expired",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        con: false,
        message: "OTP expired",
      });
    }

    // Hash the provided OTP and compare with the stored OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== user.otp) {
      return res.status(400).json({
        con: false,
        message: "Invalid OTP",
      });
    }

    user.isverified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    const token = generateToken(user._id, res);
    res.status(200).json({
      con: true,
      message: "User verified successfully",
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// resend otp
export const resendOpt = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        con: false,
        message: "Please provide userId",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }
    if (user.isverified) {
      return res.status(400).json({
        con: false,
        message: "User already verified",
      });
    }

    const plainOtp = generateOpt();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(plainOtp)
      .digest("hex");
    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 60 * 1000;
    await user.save();
    await sendOptEmail(user.email, plainOtp);
    res.status(200).json({
      con: true,
      message: "An OTP has been sent to your e-mail and is valid for 1 minute.",
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // login user
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "Please set valid Email Address",
      });
    }

    // Check if user is verified
    if (!user.isverified) {
      return res.status(400).json({
        con: false,
        message: "User not verified",
      });
    }
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      return res.status(400).json({
        con: false,
        message: "Invalid credentials",
      });
    }
    // Generate token
    const { accessToken, refreshToken } = await generateToken(user);

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // CSRF protection
    });

    res.status(200).json({
      con: true,
      message: "Login successful",
      accessToken,
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        // token: token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// logout user
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie("refreshToken");
    res.status(200).json({
      con: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
};

//refresh token
export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        con: false,
        message: "No refresh token provided",
      });
    }

    //find use with refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({
        con: false,
        message: "Invalid refresh token",
      });
    }

    //verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err || decoded.userId !== user._id.toString()) {
        return res.status(403).json({
          con: false,
          message: "Invalid refresh token",
        });
      }
    });

    //generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    res.status(200).json({
      con: true,
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

// get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    // Find the user by userId
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpire",
    );
    res.status(200).json({
      con: true,
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({ loggedIn: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.json({ loggedIn: false });
      return res.json({ loggedIn: true, userId: decoded.userId });
    });
  } catch (error) {
    return res.json({ loggedIn: false });
  }
};
