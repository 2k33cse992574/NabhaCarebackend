const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// 1. Create Razorpay order + DB entry
exports.createPayment = async (req, res) => {
  try {
    const { amount, purpose, appointmentId, prescriptionId } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: req.user.id,
      amount,
      purpose,
      appointment: appointmentId || null,
      prescription: prescriptionId || null,
      transactionId: order.id,
      status: 'created'
    });

    res.json({ order, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      { status: 'success', transactionId: razorpay_payment_id },
      { new: true }
    );

    // Link with appointment or prescription
    if (payment.purpose === 'appointment') {
      await Appointment.findByIdAndUpdate(payment.appointment, { status: 'confirmed' });
    }
    if (payment.purpose === 'medicine') {
      await Prescription.findByIdAndUpdate(payment.prescription, { dispensed: true });
    }

    res.json({ message: "Payment verified", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Patient - My payments
exports.getMyPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user.id });
  res.json(payments);
};

// 4. Admin - All payments
exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate('user', 'name phone role');
  res.json(payments);
};
