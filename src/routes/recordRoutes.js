const express = require('express');
const router = express.Router();
const { getHealthRecords, getHealthRecordsPDF } = require('../controllers/recordController');
const { authGuard } = require('../middleware/auth');

// Patient downloads JSON or PDF
router.get('/', authGuard(['patient']), getHealthRecords);
router.get('/pdf', authGuard(['patient']), getHealthRecordsPDF);

module.exports = router;
