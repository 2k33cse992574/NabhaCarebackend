const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const twilio = require('twilio');

// Load Twilio credentials from .env
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Temporary store for OTP-verified numbers (better to use Redis/DB in prod)
const verifiedPhones = new Set();

// Send OTP using Twilio
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    await client.verify.v2.services(verifyServiceSid).verifications.create({
      to: phone,
      channel: 'sms',
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const verification = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
      to: phone,
      code: otp,
    });

    if (verification.status !== 'approved') {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark phone as verified
    verifiedPhones.add(phone);

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, age, phone, role, licenseNumber } = req.body;
    if (!phone || !role) {
      return res.status(400).json({ message: "Phone and role are required" });
    }

    // Check OTP verification
    if (!verifiedPhones.has(phone)) {
      return res.status(400).json({ message: "Please verify your phone number with OTP first" });
    }

    // Role-specific validation
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (role === 'patient' && (age === undefined || age === null)) {
      return res.status(400).json({ message: "Age is required for patients" });
    }
    if ((role === 'doctor' || role === 'pharmacist') && !licenseNumber) {
      return res.status(400).json({ message: "License number is required for doctors and pharmacists" });
    }

    // Check for duplicate user
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      name,
      age,
      phone,
      role,
      licenseNumber,
      verified: role === 'patient' ? true : false // patient auto-verified; others need admin approval
    });

    // Remove phone from verified set after use
    verifiedPhones.delete(phone);

    const token = generateToken(newUser);
    return res.json({
      message: "User registered successfully",
      token,
      user: newUser
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error registering user" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    // Check OTP verification
    if (!verifiedPhones.has(phone)) {
      return res.status(400).json({ message: "Please verify your phone number with OTP first" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove phone from verified set after login
    verifiedPhones.delete(phone);

    const token = generateToken(user);
    return res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error logging in" });
  }
};
