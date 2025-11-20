const Pago = require('../models/Pago');
const Materia = require('../models/Materia');
const EstudianteMateria = require('../models/EstudianteMateria');

class PagoController {
  static async crear(req, res) {
    try {
      const { materia_id, porcentaje } = req.body;
      const estudiante_id = req.usuario.id;

      if (!materia_id || !porcentaje) {
        return res.status(400).json({ error: 'Materia y porcentaje son requeridos' });
      }

      if (![50, 100].includes(parseInt(porcentaje))) {
        return res.status(400).json({ error: 'El porcentaje debe ser 50 o 100' });
      }


      const estaMatriculado = await EstudianteMateria.verificarMatricula(estudiante_id, materia_id);
      if (!estaMatriculado) {
        return res.status(400).json({ error: 'Debe estar matriculado en la materia para realizar el pago' });
      }


      const totalPagado = await Pago.obtenerTotalPagadoPorMateria(estudiante_id, materia_id);
      const totalPagadoNum = Number(totalPagado) || 0;
      const porcentajeNum = parseInt(porcentaje);
      const nuevoTotal = totalPagadoNum + porcentajeNum;
      
      if (nuevoTotal > 100) {
        return res.status(400).json({ 
          error: `El total de pagos no puede exceder el 100%. Ya has pagado ${totalPagadoNum}% de esta materia.` 
        });
      }
      
      if (totalPagadoNum >= 100) {
        return res.status(400).json({ 
          error: 'Ya has completado el pago del 100% de esta materia.' 
        });
      }


      const materia = await Materia.obtenerPorId(materia_id);
      if (!materia) {
        return res.status(404).json({ error: 'Materia no encontrada' });
      }

      const precioBase = 1000;
      const monto = (precioBase * porcentaje) / 100;

      const pagoId = await Pago.crear({
        tipo_pago: 'estudiante',
        estudiante_id,
        materia_id,
        monto,
        porcentaje: parseInt(porcentaje)
      });

      res.status(201).json({ 
        message: 'Pago realizado exitosamente',
        id: pagoId 
      });
    } catch (error) {
      console.error('Error al crear pago:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerTodos(req, res) {
    try {
      const pagos = await Pago.obtenerTodos();
      res.json(pagos);
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPorEstudiante(req, res) {
    try {
      const estudiante_id = req.usuario.id;
      const pagos = await Pago.obtenerPorEstudiante(estudiante_id);
      res.json(pagos);
    } catch (error) {
      console.error('Error al obtener pagos del estudiante:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPorMateria(req, res) {
    try {
      const { materia_id } = req.params;
      const pagos = await Pago.obtenerPorMateria(materia_id);
      res.json(pagos);
    } catch (error) {
      console.error('Error al obtener pagos por materia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPorDocente(req, res) {
    try {
      const docente_id = req.usuario.id;
      const pagos = await Pago.obtenerPorDocente(docente_id);
      res.json(pagos);
    } catch (error) {
      console.error('Error al obtener pagos del docente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerTotalPagado(req, res) {
    try {
      const estudiante_id = req.usuario.id;
      const { materia_id } = req.params;
      const totalPagado = await Pago.obtenerTotalPagadoPorMateria(estudiante_id, materia_id);
      res.json({ totalPagado: Number(totalPagado) || 0 });
    } catch (error) {
      console.error('Error al obtener total pagado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async crearAdministrativo(req, res) {
    try {
      const { docente_id, monto, descripcion, categoria } = req.body;

      if (!monto || !descripcion || !categoria) {
        return res.status(400).json({ error: 'Monto, descripción y categoría son requeridos' });
      }

      if (isNaN(monto) || parseFloat(monto) <= 0) {
        return res.status(400).json({ error: 'El monto debe ser un número positivo' });
      }

      // Si es un sueldo, verificar que el docente_id esté presente
      if (categoria === 'Sueldo' && !docente_id) {
        return res.status(400).json({ error: 'Debe seleccionar un docente para pagos de sueldo' });
      }

      const pagoId = await Pago.crearAdministrativo({
        docente_id: categoria === 'Sueldo' ? docente_id : null,
        monto: parseFloat(monto),
        descripcion,
        categoria
      });

      res.status(201).json({ 
        message: 'Pago administrativo registrado exitosamente',
        id: pagoId 
      });
    } catch (error) {
      console.error('Error al crear pago administrativo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerAdministrativos(req, res) {
    try {
      const pagos = await Pago.obtenerAdministrativos();
      res.json(pagos);
    } catch (error) {
      console.error('Error al obtener pagos administrativos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = PagoController;

