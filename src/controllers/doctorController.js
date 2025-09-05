const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const { name, licenseNumber } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, licenseNumber }, { new: true });
  res.json({ message: "Profile updated", user });
};

// Later: Prescription API placeholder
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('patient');
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (appointment.status !== 'accepted') {
      return res.status(400).json({ message: "Prescription can only be created for accepted appointments" });
    }

    const prescription = await Prescription.create({
      patient: appointment.patient._id,
      doctor: req.user.id,
      appointment: appointment._id,
      medicines,
      notes
    });

    return res.json({ message: "Prescription created", prescription });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Doctor gets all prescriptions he created
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user.id })
      .populate('patient', 'name phone')
      .populate('appointment', 'date time status');

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all appointments assigned to logged-in doctor
exports.getAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name age phone');

    return res.json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Accept or Reject appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    return res.json({ success: true, appointment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'scheduled'
    });
    const prescriptions = await Prescription.countDocuments({ doctor: doctorId });

    res.json({
      totalAppointments,
      upcomingAppointments,
      prescriptions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
