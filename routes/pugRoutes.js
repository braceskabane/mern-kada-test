const express = require("express");
const router = express.Router();
const {
  getHomePage,
  renderPostList,
  renderAddPostForm,
  renderEditPostForm,
  renderDeletePostForm,
} = require("../controllers/pugController");

router.get("/", getHomePage);
router.get("/posts", renderPostList);
router.get("/posts/page/:page", renderPostList);

router.get("/posts/add", renderAddPostForm);
router.post("/posts/add", renderAddPostForm);

router.get("/post/:id/edit", renderEditPostForm);
router.post("/post/:id/edit", renderEditPostForm);

router.get("/post/:id/delete", renderDeletePostForm);

module.exports = router;
