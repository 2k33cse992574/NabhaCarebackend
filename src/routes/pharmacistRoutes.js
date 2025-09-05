const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');
const { authGuard } = require('../middleware/auth');
const pendingGuard = require('../middleware/pendingGuard');

router.get('/profile', authGuard(['pharmacist']), pendingGuard, pharmacistController.getProfile);
router.patch('/profile', authGuard(['pharmacist']), pendingGuard, pharmacistController.updateProfile);

// Stock (placeholder for now)
router.post('/stock', authGuard(['pharmacist']), pendingGuard, pharmacistController.addOrUpdateStock);
router.get('/stock', authGuard(['pharmacist']), pendingGuard, pharmacistController.getStock);
router.patch('/stock/:id', authGuard(['pharmacist']), pendingGuard, pharmacistController.updateMedicine);
router.delete('/stock/:id', authGuard(['pharmacist']), pendingGuard, pharmacistController.deleteMedicine);

// Prescriptions
router.get('/prescriptions', authGuard(['pharmacist']), pharmacistController.getPrescriptions);
router.get('/prescriptions/pending', authGuard(['pharmacist']), pharmacistController.getPendingPrescriptions);
router.patch('/prescriptions/:id/dispense', authGuard(['pharmacist']), pharmacistController.markDispensed);
router.get('/stock', authGuard(['patient']), pharmacistController.checkStock);
router.get('/dashboard', authGuard(['pharmacist']), pendingGuard, pharmacistController.getDashboard);


module.exports = router;
