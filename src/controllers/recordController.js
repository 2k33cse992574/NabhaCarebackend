const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// JSON health records (already done)
exports.getHealthRecords = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await Appointment.find({ patient: patientId }).populate('doctor', 'name');
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'name')
      .populate('appointment', 'date time');

    res.json({
      patient: req.user,
      appointments,
      prescriptions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Export records as PDF
exports.getHealthRecordsPDF = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await User.findById(patientId);

    const appointments = await Appointment.find({ patient: patientId }).populate('doctor', 'name');
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'name')
      .populate('appointment', 'date time');

    // Create PDF doc
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=health_records.pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text(`Health Records for ${patient.name}`, { align: 'center' });
    doc.moveDown();

    // Appointments
    doc.fontSize(14).text("Appointments:", { underline: true });
    appointments.forEach(a => {
      doc.fontSize(12).text(`- ${a.date} ${a.time} with Dr. ${a.doctor?.name} (${a.status})`);
    });
    doc.moveDown();

    // Prescriptions
    doc.fontSize(14).text("Prescriptions:", { underline: true });
    prescriptions.forEach(p => {
      doc.fontSize(12).text(`- From Dr. ${p.doctor?.name} | Appointment: ${p.appointment?.date}`);
      doc.text(`  Medicines: ${p.medicines?.map(m => `${m.name} (${m.dosage})`).join(", ")}`);
      doc.text(`  Dispensed: ${p.dispensed ? "Yes" : "No"}`);
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
