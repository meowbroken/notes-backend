import express from "express";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message:  email + " already exists" });

    const user = await User.create({ email, password });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("Register error:", {
      message: err?.message,
      name: err?.name,
      code: err?.code,
      stack: err?.stack,
      body: req.body,
    });

    if (err?.code === 11000) {
        return res.status(400).json({ message: email + " already exists" });
    }

    if (err?.name === "ValidationError") {
      const first = Object.values(err.errors || {})[0];
      return res.status(400).json({ message: first?.message || "Validation error" });
    }

    const isProd = process.env.NODE_ENV === "production";
    return res.status(500).json({
      message: "Server error",
      ...(isProd ? {} : { error: err?.message || String(err) }),
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        accessToken,
        user: { id: user._id, email: user.email },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(payload.userId);
    res.json({ accessToken: newAccessToken });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken").json({ message: "Logged out" });
});

export default router;