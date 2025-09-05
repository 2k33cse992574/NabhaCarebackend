const cron = require("node-cron");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const User = require("../models/User");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // you can use SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📩 Utility to send SMS
async function sendSMS(to, message) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (err) {
    console.error("SMS error:", err.message);
  }
}

// 📧 Utility to send Email
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"Nabha Telemedicine" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

// ⏰ CRON JOBS
// 1. Appointment reminders (every 5 min check)
cron.schedule("*/5 * * * *", async () => {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 60 * 60 * 1000); // +1hr

  const appointments = await Appointment.find({
    date: { $gte: now, $lte: upcoming },
    status: "confirmed",
  }).populate("patient doctor");

  appointments.forEach(app => {
    const msg = `Reminder: Your appointment with Dr. ${app.doctor.name} is in 1 hour.`;
    if (app.patient.phone) sendSMS(app.patient.phone, msg);
    if (app.patient.email) sendEmail(app.patient.email, "Appointment Reminder", msg);
  });
});

// 2. Prescription refill reminders (daily at 9am)
cron.schedule("0 9 * * *", async () => {
  const prescriptions = await Prescription.find({ dispensed: true }).populate("patient doctor");

  prescriptions.forEach(pres => {
    const msg = `Reminder: Please refill your medicine prescribed by Dr. ${pres.doctor.name}.`;
    if (pres.patient.phone) sendSMS(pres.patient.phone, msg);
    if (pres.patient.email) sendEmail(pres.patient.email, "Medicine Refill Reminder", msg);
  });
});

module.exports = { sendSMS, sendEmail };
