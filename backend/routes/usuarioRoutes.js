const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, UsuarioController.crear);
router.get('/', auth, adminOnly, UsuarioController.obtenerTodos);
router.get('/rol/:rol', auth, adminOnly, UsuarioController.obtenerPorRol);
router.delete('/:id', auth, adminOnly, UsuarioController.eliminar);

module.exports = router;

