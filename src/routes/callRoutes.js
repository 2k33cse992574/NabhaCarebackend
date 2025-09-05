const express = require('express');
const router = express.Router();
const {
  getVideoToken,
  getVoiceToken,
  createVideoRoom,
  initiateVoiceCall
} = require('../controllers/callController');
const { authGuard } = require('../middleware/auth');

// Patients, Doctors, Pharmacists can request tokens
router.post('/video/token', authGuard(['patient','doctor','pharmacist']), getVideoToken);
router.post('/voice/token', authGuard(['patient','doctor','pharmacist']), getVoiceToken);

// Only doctor & patient can start appointment calls
router.post('/video', authGuard(['doctor','patient']), createVideoRoom);
router.post('/voice', authGuard(['doctor','patient']), initiateVoiceCall);

module.exports = router;
