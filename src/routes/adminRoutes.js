const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { getPendingUsers, verifyUser } = adminController;

const { authGuard } = require('../middleware/auth');   // import correctly

// Require JWT auth with role 'admin'
router.get('/pending', authGuard(['admin']), getPendingUsers);
router.patch('/verify/:id', authGuard(['admin']), verifyUser);
router.get('/dashboard', authGuard(['admin']), adminController.getDashboard);

module.exports = router;
