const express = require('express');
const router = express.Router();
const authMiddleware = require('../controllers/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const User = require('../models/User');
const userController = require('../controllers/userController');

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

// Admin-only: delete a user by id
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
