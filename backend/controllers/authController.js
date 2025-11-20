const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const jwtSecret = process.env.JWT_SECRET || 'tu_secreto_jwt_muy_seguro_cambiar_en_produccion';
      
      if (!jwtSecret || jwtSecret === 'tu_secreto_jwt_muy_seguro_cambiar_en_produccion') {
        console.warn('ADVERTENCIA: JWT_SECRET no está configurado. Usando valor por defecto.');
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const jwtSecret = process.env.JWT_SECRET || 'tu_secreto_jwt_muy_seguro_cambiar_en_produccion';
      const decoded = jwt.verify(token, jwtSecret);
      const usuario = await Usuario.buscarPorId(decoded.id);

      if (!usuario) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
}

module.exports = AuthController;

