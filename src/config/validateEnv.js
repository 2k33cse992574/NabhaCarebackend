const required = [
  "MONGO_URI",
  "JWT_SECRET",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_API_KEY_SID",
  "TWILIO_API_SECRET",
  "TWILIO_PHONE_NUMBER"
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env var: ${key}`);
  }
});
