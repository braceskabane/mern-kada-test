const express = require("express");
const router = express.Router();
const {
  renderRegisterBearer,
  registerBearer,
  renderLoginBearer,
  loginBearer,
  dashboardBearer,
} = require("../controllers/pugAuthController");
const { bearerAuth } = require("../middleware/bearerAuth");

router.get("/register-bearer", renderRegisterBearer);
router.post("/register-bearer", registerBearer);

router.get("/login-bearer", renderLoginBearer);
router.post("/login-bearer", loginBearer);

router.get("/dashboard-bearer", bearerAuth, dashboardBearer);

module.exports = router;
