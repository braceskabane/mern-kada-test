const jwt = require("jsonwebtoken");
const User = require("../models/Auth");

const protect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    if (req.accepts("html")) {
      return res.redirect("/login");
    }
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.clearCookie("token");
    if (req.accepts("html")) {
      return res.redirect("/login");
    }
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const getUser = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    res.locals.user = req.user;
  } catch (error) {
    res.locals.user = null;
  }
  next();
};

module.exports = { protect, getUser };
