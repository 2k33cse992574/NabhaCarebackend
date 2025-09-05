require('dotenv').config();
require('./src/config/validateEnv');


const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const pharmacistRoutes = require('./src/routes/pharmacistRoutes');
const symptomRoutes = require('./src/routes/symptomRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const reportRoutes = require("./src/routes/reportRoutes");


// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(errorHandler);
// Connect to DB
connectDB();

const seedAdmin = require('./src/config/seedAdmin');
seedAdmin();

// Security headers
app.use(helmet());

// Rate limiter (100 requests / 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});
app.use(limiter);


// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: "Nabha Healthcare Backend Running" });
});

// TODO: Add routes
// app.use('/auth', require('./src/routes/authRoutes'));
app.use('/auth', require('./src/routes/authRoutes'));
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/pharmacist', pharmacistRoutes);
app.use('/symptoms', symptomRoutes);
app.use('/records', recordRoutes);
app.use('/notifications', notificationRoutes);
app.use('/calls', require('./src/routes/callRoutes'));
app.use('/payments', require('./src/routes/paymentRoutes'));
app.use("/analytics", analyticsRoutes);
app.use("/reports", reportRoutes);

// Notifications auto-start
require("./src/services/notificationService");




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
