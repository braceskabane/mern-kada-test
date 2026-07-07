const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Auth");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userData = await User.findOne({ email });

    if (userData) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  } catch (error) {
    console.error("User registration failed:", error);
    res.status(500).json({ message: "User registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("User login failed:", error);
    res.status(500).json({ message: "User login failed" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "User logged out successfully" });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user failed:", error);
    res.status(500).json({ message: "Get user failed" });
  }
};

module.exports = {
  generateToken,
  setTokenCookie,
  register,
  login,
  logout,
  getMe,
};
