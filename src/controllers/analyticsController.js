const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const User = require("../models/User");

exports.getAnalytics = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPharmacists = await User.countDocuments({ role: "pharmacist" });

    const totalAppointments = await Appointment.countDocuments();
    const confirmedAppointments = await Appointment.countDocuments({ status: "confirmed" });
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

    const prescriptionsIssued = await Prescription.countDocuments();
    const prescriptionsDispensed = await Prescription.countDocuments({ dispensed: true });

    res.json({
      users: { totalPatients, totalDoctors, totalPharmacists },
      appointments: { totalAppointments, confirmedAppointments, pendingAppointments },
      prescriptions: { prescriptionsIssued, prescriptionsDispensed },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
