const User = require('../models/User');

// List unverified doctors/pharmacists
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: { $in: ['doctor', 'pharmacist'] },
      verified: false
    }).select('-__v -password'); // clean response
    return res.json({ message: "Pending users", users: pendingUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching pending users" });
  }
};

// Approve a user by ID
exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.verified = true;
    await user.save();

    res.json({ message: "User verified successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const pendingDoctors = await User.countDocuments({ role: 'doctor', verified: false });
    const pendingPharmacists = await User.countDocuments({ role: 'pharmacist', verified: false });
    const totalDoctors = await User.countDocuments({ role: 'doctor', verified: true });
    const totalPharmacists = await User.countDocuments({ role: 'pharmacist', verified: true });

    res.json({
      pendingDoctors,
      pendingPharmacists,
      totalDoctors,
      totalPharmacists
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
