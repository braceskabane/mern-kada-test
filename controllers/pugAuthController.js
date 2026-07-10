const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const renderRegisterBearer = (req, res) => {
  res.render("user/register-bearer", {
    siteTitle: req.app.locals.siteTitle,
  });
};

const registerBearer = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("user/register-bearer", {
        siteTitle: req.app.locals.siteTitle,
        error: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("user/register-bearer", {
        siteTitle: req.app.locals.siteTitle,
        error: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);

    res.render("user/register-bearer", {
      siteTitle: req.app.locals.siteTitle,
      success: "Registration successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.render("user/register-bearer", {
      siteTitle: req.app.locals.siteTitle,
      error: "Registration failed",
    });
  }
};

const renderLoginBearer = (req, res) => {
  res.render("user/login-bearer", {
    siteTitle: req.app.locals.siteTitle,
  });
};

const loginBearer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("user/login-bearer", {
        siteTitle: req.app.locals.siteTitle,
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("user/login-bearer", {
        siteTitle: req.app.locals.siteTitle,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.render("user/login-bearer", {
      siteTitle: req.app.locals.siteTitle,
      success: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.render("user/login-bearer", {
      siteTitle: req.app.locals.siteTitle,
      error: "Login failed",
    });
  }
};

const dashboardBearer = async (req, res) => {
  res.render("user/dashboard-bearer", {
    siteTitle: req.app.locals.siteTitle,
    user: req.user,
  });
};

module.exports = {
  renderRegisterBearer,
  registerBearer,
  renderLoginBearer,
  loginBearer,
  dashboardBearer,
};
