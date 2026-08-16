const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateSubsidy } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/subsidy', authMiddleware, updateSubsidy);

module.exports = router;
