const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authGuard } = require('../middleware/auth');
const pendingGuard = require('../middleware/pendingGuard');

router.get('/profile', authGuard(['doctor']), pendingGuard, doctorController.getProfile);
router.patch('/profile', authGuard(['doctor']), pendingGuard, doctorController.updateProfile);
router.post('/prescription', authGuard(['doctor']), pendingGuard, doctorController.createPrescription);
router.get('/appointments', authGuard(['doctor']), doctorController.getAppointments);
router.patch('/appointments/:id', authGuard(['doctor']), doctorController.updateAppointmentStatus);
router.post('/prescriptions', authGuard(['doctor']), doctorController.createPrescription);
router.get('/prescriptions', authGuard(['doctor']), doctorController.getPrescriptions);
router.get('/dashboard', authGuard(['doctor']), pendingGuard, doctorController.getDashboard);
module.exports = router;
