const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/authMiddleware');
const roleMiddleware = require('../controllers/roleMiddleware');

//Protect all routes:User must be logged in AND be an admin to access these routes
router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.get('/', userController.getAllUsers);
router.post('/',userController.adminCreateUser);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);
router.get('/:id',userController.getUser);

module.exports = router;