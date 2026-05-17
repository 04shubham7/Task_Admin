const express = require('express');
const router = express.Router();
const authMiddleware = require('../controllers/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const User = require('../models/User');

// Admin-only route to list users (safe fields)
router.get('/', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'role', 'createdAt'] });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
