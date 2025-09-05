const express = require("express");
const router = express.Router();
const { exportAppointmentsPDF } = require("../controllers/reportController");
const { authGuard } = require("../middleware/auth");

router.get("/appointments/pdf", authGuard(["admin"]), exportAppointmentsPDF);

module.exports = router;
