const PDFDocument = require("pdfkit");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

exports.exportAppointmentsPDF = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient doctor");

    // Create a new PDF
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=appointments.pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Appointments Report", { align: "center" });
    doc.moveDown();

    // Add appointment list
    appointments.forEach((a, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. Patient: ${a.patient?.name || "N/A"}, Doctor: ${a.doctor?.name || "N/A"}, Status: ${a.status}`,
          { align: "left" }
        );
    });

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
