const express = require('express');
const { registerUser, getUser, deleteUser, updateUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);
router.post('/login', loginUser);

module.exports = router;
