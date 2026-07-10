const express = require("express");
const router = express.Router();
const {
  getHomePage,
  renderPostList,
  renderAddPostForm,
  renderEditPostForm,
  renderDeletePostForm,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/pugController");
const { ensureAuthenticated } = require("../middleware/passport");

router.get("/", getHomePage);
router.get("/posts", renderPostList);
router.get("/posts/page/:page", renderPostList);

router.get("/posts/add", ensureAuthenticated, renderAddPostForm);
router.post("/posts/add", ensureAuthenticated, renderAddPostForm);

router.get("/post/:id/edit", ensureAuthenticated, renderEditPostForm);
router.post("/post/:id/edit", ensureAuthenticated, renderEditPostForm);

router.get("/post/:id/delete", ensureAuthenticated, renderDeletePostForm);

router.get("/register", registerUser);
router.post("/register", registerUser);

router.get("/login", loginUser);
router.post("/login", loginUser);

router.get("/logout", logoutUser);

module.exports = router;
