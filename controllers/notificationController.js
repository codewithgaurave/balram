const Notification = require('../models/notificationModel');
const User = require('../models/user');

const sendNotificationToAllUsers = async (req, res) => {
    try {
      const { title, message } = req.body;
  
      if (!title || !message) {
        return res.status(400).json({ message: 'Title and message are required' });
      }
  
      const users = await User.find({}, { _id: 1 }); // Fetch all users' IDs
  
      const notifications = users.map((user) => ({
        title,
        message,
        userId: user._id, // Associate the notification with each user
      }));
  
      // Insert all notifications in bulk
      await Notification.insertMany(notifications);
  
      res.status(200).json({ message: 'Notification sent to all users successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const getUserNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found for this user' });
      }
  
      res.status(200).json({ notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
module.exports = { sendNotificationToAllUsers, getUserNotifications };