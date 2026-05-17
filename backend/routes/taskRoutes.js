const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../controllers/authMiddleware');
const upload = require('../config/s3');

router.get('/download', taskController.downloadDocument);

//All task routes are protected, require authentication
router.use(authMiddleware);

router.post('/', upload.array('documents', 3), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTasks);
router.patch('/:id/status', taskController.updateTaskStatus);
router.put('/:id', upload.array('documents', 3), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;