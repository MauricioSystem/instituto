require('dotenv').config();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
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

    req.usuario = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores' });
  }
  next();
};

const docenteOnly = (req, res, next) => {
  if (req.usuario.rol !== 'docente') {
    return res.status(403).json({ error: 'Acceso denegado. Solo docentes' });
  }
  next();
};

const estudianteOnly = (req, res, next) => {
  if (req.usuario.rol !== 'estudiante') {
    return res.status(403).json({ error: 'Acceso denegado. Solo estudiantes' });
  }
  next();
};

module.exports = { auth, adminOnly, docenteOnly, estudianteOnly };

