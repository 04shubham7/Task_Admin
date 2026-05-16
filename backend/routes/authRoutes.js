const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../controllers/authMiddleware');

// Registration should be public; don't require authMiddleware
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;