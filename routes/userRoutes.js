const express = require('express');
const { 
  registerUser, 
  getUser, 
  deleteUser, 
  updateUser, 
  loginUser, 
  getAllUsers 
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.get('/login', loginUser);
router.get('/registeruser', getAllUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

module.exports = router;