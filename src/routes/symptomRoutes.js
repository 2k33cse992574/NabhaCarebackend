// src/routes/symptomRoutes.js

const express = require('express');
const router = express.Router();
const { checkSymptoms } = require('../controllers/symptomController');
const { authGuard } = require('../middleware/auth');

// Patient can use AI symptom checker
router.post('/check', authGuard(['patient']), checkSymptoms);

module.exports = router;
