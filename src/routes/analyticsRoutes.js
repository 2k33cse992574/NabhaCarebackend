const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { authGuard } = require("../middleware/auth");

// Only admin can access
router.get("/", authGuard(["admin"]), getAnalytics);

module.exports = router;
