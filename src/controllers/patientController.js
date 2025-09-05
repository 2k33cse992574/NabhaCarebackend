const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const { name, age } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, age }, { new: true });
  res.json({ message: "Profile updated", user });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE patient profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BOOK appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, symptoms } = req.body;
    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor and date required" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      symptoms
    });

    res.json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET my appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name phone');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Patient sees prescriptions given to them
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'name phone')
      .populate('appointment', 'date time status');

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await Appointment.countDocuments({ patient: patientId });
    const prescriptions = await Prescription.countDocuments({ patient: patientId });
    const nextAppointment = await Appointment.findOne({ patient: patientId, status: 'scheduled' })
      .sort({ date: 1 });

    res.json({
      totalAppointments: appointments,
      prescriptions,
      nextAppointment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};