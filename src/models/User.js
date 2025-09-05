const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number }, // only for patients
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['patient', 'doctor', 'pharmacist', 'admin'], required: true },
  licenseNumber: { type: String }, // only for doctor/pharmacist
  verified: { type: Boolean, default: false }, // admin approval for doctor/pharmacist
}, { timestamps: true });

// Auto verify patient by default
userSchema.pre('save', function(next) {
  if (this.role === 'patient') {
    this.verified = true;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
