const express = require('express');
const router = express.Router();
const {
  createPayment,
  verifyPayment,
  getMyPayments,
  getAllPayments
} = require('../controllers/paymentController');
const { authGuard } = require('../middleware/auth');

// Patients/Doctors/Pharmacists can initiate payment
router.post('/create', authGuard(['patient','doctor','pharmacist']), createPayment);

// Verify Razorpay payment
router.post('/verify', authGuard(['patient','doctor','pharmacist']), verifyPayment);

// Patient: view own payments
router.get('/my', authGuard(['patient']), getMyPayments);

// Admin: view all payments
router.get('/all', authGuard(['admin']), getAllPayments);

module.exports = router;
