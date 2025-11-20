const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

class UsuarioController {
  static async crear(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      if (!['admin', 'docente', 'estudiante'].includes(rol)) {
        return res.status(400).json({ error: 'Rol inválido' });
      }

      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const usuarioId = await Usuario.crear({
        nombre,
        email,
        password: hashedPassword,
        rol
      });

      res.status(201).json({ 
        message: 'Usuario creado exitosamente',
        id: usuarioId 
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerTodos(req, res) {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPorRol(req, res) {
    try {
      const { rol } = req.params;
      const usuarios = await Usuario.obtenerPorRol(rol);
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await Usuario.eliminar(id);
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = UsuarioController;

