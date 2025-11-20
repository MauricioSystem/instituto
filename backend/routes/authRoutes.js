const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/login', AuthController.login);
router.get('/verify', auth, AuthController.verificarToken);

module.exports = router;

