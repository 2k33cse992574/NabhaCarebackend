const { authGuard } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Only admin should see pending doctors/pharmacists
router.get('/pending', authGuard(['admin']), adminController.listPending);

module.exports = router;
