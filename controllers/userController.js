const User = require('../models/user');
const bcrypt = require('bcryptjs');  
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Notification = require('../models/notificationModel');

// Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      number,
    });

    // Save the user
    await user.save();

    // Send success response with the user's name and email (excluding sensitive data)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User by email or ID
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId); // Or find by email: await User.findOne({ email: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete User by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Data
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, number } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.number = number || user.number;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        name: user.name,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      notifications,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  //get all users
  const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); 
      res.status(200).json({
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { registerUser, getUser, deleteUser, updateUser, loginUser, getAllUsers };
