const express = require("express");
const router = express.Router();
const { getHomePage, renderPostList } = require("../controllers/pugController");

router.get("/", getHomePage);
router.get("/posts", renderPostList);
router.get("/posts/page/:page", renderPostList);

module.exports = router;
