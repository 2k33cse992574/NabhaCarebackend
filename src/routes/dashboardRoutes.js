const express = require('express');
const router = express.Router();
const { authGuard } = require('../middleware/auth');

router.get('/patient', authGuard(['patient']), (req, res) => {
  res.json({ message: "Welcome Patient Dashboard" });
});

router.get('/doctor', authGuard(['doctor']), (req, res) => {
  res.json({ message: "Welcome Doctor Dashboard (must be verified)" });
});

router.get('/pharmacist', authGuard(['pharmacist']), (req, res) => {
  res.json({ message: "Welcome Pharmacist Dashboard (must be verified)" });
});

router.get('/admin', authGuard(['admin']), (req, res) => {
  res.json({ message: "Welcome Admin Dashboard" });
});

module.exports = router;
