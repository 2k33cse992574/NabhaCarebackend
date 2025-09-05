const User = require('../models/User');

const seedAdmin = async () => {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) {
    console.log("ADMIN_PHONE not set in .env");
    return;
  }

  const existing = await User.findOne({ phone: adminPhone, role: 'admin' });
  if (existing) {
    console.log(`Admin already exists: ${adminPhone}`);
    return;
  }

  await User.create({
    phone: adminPhone,
    role: 'admin',
    verified: true
  });

  console.log(`Admin seeded successfully: ${adminPhone}`);
};

module.exports = seedAdmin;
