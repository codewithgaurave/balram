const express = require('express');
const { sendNotificationToAllUsers, getUserNotifications } = require('../controllers/notificationController');
const router = express.Router();
const { protectRoute } = require('../middleware/notificationMiddleware');

router.post('/sendall' , sendNotificationToAllUsers);
router.get('/user/:userId', getUserNotifications);

module.exports = router;
