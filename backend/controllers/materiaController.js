const Materia = require('../models/Materia');
const EstudianteMateria = require('../models/EstudianteMateria');

class MateriaController {
  static async crear(req, res) {
    try {
      const { nombre, horario } = req.body;
      const docente_id = req.usuario.id;

      if (!nombre || !horario) {
        return res.status(400).json({ error: 'Nombre y horario son requeridos' });
      }

      const materiaId = await Materia.crear({ nombre, horario, docente_id });
      res.status(201).json({ 
        message: 'Materia creada exitosamente',
        id: materiaId 
      });
    } catch (error) {
      console.error('Error al crear materia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerTodas(req, res) {
    try {
      const materias = await Materia.obtenerTodas();
      res.json(materias);
    } catch (error) {
      console.error('Error al obtener materias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const materia = await Materia.obtenerPorId(id);
      if (!materia) {
        return res.status(404).json({ error: 'Materia no encontrada' });
      }
      res.json(materia);
    } catch (error) {
      console.error('Error al obtener materia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPorDocente(req, res) {
    try {
      const docente_id = req.usuario.id;
      const materias = await Materia.obtenerPorDocente(docente_id);
      res.json(materias);
    } catch (error) {
      console.error('Error al obtener materias del docente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerMateriasDelEstudiante(req, res) {
    try {
      const estudiante_id = req.usuario.id;
      const materias = await Materia.obtenerMateriasDelEstudiante(estudiante_id);
      res.json(materias);
    } catch (error) {
      console.error('Error al obtener materias del estudiante:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async matricular(req, res) {
    try {
      const { materia_id } = req.body;
      const estudiante_id = req.usuario.id;

      if (!materia_id) {
        return res.status(400).json({ error: 'ID de materia es requerido' });
      }

      await EstudianteMateria.matricular(estudiante_id, materia_id);
      res.json({ message: 'Matriculado exitosamente' });
    } catch (error) {
      if (error.message === 'El estudiante ya está matriculado en esta materia') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error al matricular:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await Materia.eliminar(id);
      res.json({ message: 'Materia eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = MateriaController;

