const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notificationController');
const { authGuard } = require('../middleware/auth');

router.post('/', authGuard(['admin', 'doctor', 'pharmacist']), sendNotification);

module.exports = router;
