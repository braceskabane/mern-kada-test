const Post = require("../models/Post");
const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { generateToken, setTokenCookie } = require("../controllers/authController");

const getHomePage = (req, res) => {
  res.render("index", { siteTitle: req.app.locals.siteTitle });
};

const renderPostList = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    res.render("post/list", {
      siteTitle: req.app.locals.siteTitle,
      posts,
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      pages,
    });
  } catch (error) {
    res.render("post/list", {
      siteTitle: req.app.locals.siteTitle,
      posts: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: 1,
      prevPage: 1,
      pages: [],
      error: "Gagal memuat data posts",
    });
  }
};

const renderAddPostForm = async (req, res) => {
  if (req.method === "GET") {
    return res.render("post/add", {
      siteTitle: req.app.locals.siteTitle,
    });
  }
  const { title, content, category } = req.body;
  await Post.create({ title, content, category });
  res.redirect("/posts");
};

const renderEditPostForm = async (req, res) => {
  if (req.method === "GET") {
    const post = await Post.findById(req.params.id);
    return res.render("post/edit", {
      siteTitle: req.app.locals.siteTitle,
      post,
    });
  }
  const { title, content, category } = req.body;
  await Post.findByIdAndUpdate(req.params.id, { title, content, category });
  res.redirect("/posts");
};

const renderDeletePostForm = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
};

const registerUser = async (req, res) => {
  if (req.method === "GET") {
    return res.render("user/register", {
      siteTitle: req.app.locals.siteTitle,
    });
  }
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("user/register", {
        siteTitle: req.app.locals.siteTitle,
        error: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("user/register", {
        siteTitle: req.app.locals.siteTitle,
        error: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res.redirect("/");
  } catch (error) {
    res.render("user/register", {
      siteTitle: req.app.locals.siteTitle,
      error: "Registration failed",
    });
  }
};

const loginUser = (req, res, next) => {
  if (req.method === "GET") {
    return res.render("user/login", {
      siteTitle: req.app.locals.siteTitle,
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.render("user/login", {
        siteTitle: req.app.locals.siteTitle,
        error: "Login failed",
      });
    }

    if (!user) {
      return res.render("user/login", {
        siteTitle: req.app.locals.siteTitle,
        error: info.message || "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res.redirect("/");
  })(req, res, next);
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.redirect("/login");
};

module.exports = {
  getHomePage,
  renderPostList,
  renderAddPostForm,
  renderEditPostForm,
  renderDeletePostForm,
  registerUser,
  loginUser,
  logoutUser,
};
