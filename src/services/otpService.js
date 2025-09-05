const otpStore = {}; // { phone: otp }

const generateOTP = (phone) => {
  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  otpStore[phone] = otp;
  console.log(`OTP for ${phone}: ${otp}`); // For demo only
  return otp;
};

const verifyOTP = (phone, otp) => {
  return otpStore[phone] && otpStore[phone].toString() === otp.toString();
};

module.exports = { generateOTP, verifyOTP };
