const jwt = require("jsonwebtoken");
const User = require("../models/Auth");

const bearerAuth = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    if (req.accepts("html")) {
      return res.redirect("/login-bearer");
    }
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      if (req.accepts("html")) {
        return res.redirect("/login-bearer");
      }
      return res.status(401).json({ message: "User not found" });
    }

    res.locals.user = req.user;
    next();
  } catch (error) {
    console.error("Bearer token verification failed:", error);
    if (req.accepts("html")) {
      return res.redirect("/login-bearer");
    }
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

const attachUserFromBearer = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    res.locals.user = req.user || null;
  } catch (error) {
    res.locals.user = null;
  }
  next();
};

module.exports = { bearerAuth, attachUserFromBearer };
