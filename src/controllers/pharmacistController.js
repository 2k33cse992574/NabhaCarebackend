const User = require('../models/User');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, licenseNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, licenseNumber },
      { new: true }
    ).select('-__v');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stock update placeholder
// Pharmacist updates stock (already placeholder)
exports.updateStock = async (req, res) => {
  const { medicines } = req.body; 
  // Example: [{ name: "Paracetamol", quantity: 50 }, { name: "Ibuprofen", quantity: 20 }]

  // In real: should be separate Stock model
  req.user.stock = medicines;
  await req.user.save();

  res.json({ message: "Stock updated", stock: medicines });
};

// Patient checks stock
exports.checkStock = async (req, res) => {
  try {
    const pharmacists = await User.find({ role: 'pharmacist' }, 'name stock');
    res.json(pharmacists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name phone')
      .populate('doctor', 'name phone')
      .populate('appointment', 'date time status');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ dispensed: { $ne: true } })
      .populate('patient', 'name phone')
      .populate('doctor', 'name phone')
      .populate('appointment', 'date time');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markDispensed = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { dispensed: true },
      { new: true }
    );
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    res.json({ message: "Prescription marked as dispensed", prescription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const pendingPrescriptions = await Prescription.countDocuments({ dispensed: { $ne: true } });

    res.json({
      pendingPrescriptions,
      stockStatus: "Stock module coming soon"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Add or update stock
exports.addOrUpdateStock = async (req, res) => {
  try {
    const { name, quantity, expiryDate } = req.body;
    if (!name || quantity == null) {
      return res.status(400).json({ message: "Name and quantity required" });
    }

    let medicine = await Medicine.findOne({ name, pharmacist: req.user.id });
    if (medicine) {
      medicine.quantity += Number(quantity);
      if (expiryDate) medicine.expiryDate = expiryDate;
      await medicine.save();
    } else {
      medicine = await Medicine.create({
        name,
        quantity,
        expiryDate,
        pharmacist: req.user.id
      });
    }

    res.json({ message: "Stock updated", medicine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get stock list
exports.getStock = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacist: req.user.id });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update specific medicine (set quantity)
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const medicine = await Medicine.findOneAndUpdate(
      { _id: id, pharmacist: req.user.id },
      { quantity },
      { new: true }
    );

    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine updated", medicine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOneAndDelete({ _id: id, pharmacist: req.user.id });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


