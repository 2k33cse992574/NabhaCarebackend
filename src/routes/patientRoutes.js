const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController'); 
const { getProfile, updateProfile, bookAppointment, getAppointments } = require('../controllers/patientController');
const { authGuard } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const appointmentSchema = require('../validation/appointmentSchema');

// Patient-only routes
router.get('/profile', authGuard(['patient']), getProfile);
router.patch('/profile', authGuard(['patient']), updateProfile);

router.post('/appointments', authGuard(['patient']), bookAppointment);
router.get('/appointments', authGuard(['patient']), getAppointments);

router.get('/prescriptions', authGuard(['patient']), patientController.getPrescriptions);
router.get('/dashboard', authGuard(['patient']), patientController.getDashboard);

router.post('/appointments',
  authGuard(['patient']),
  validate(appointmentSchema),
  bookAppointment
);

module.exports = router;
