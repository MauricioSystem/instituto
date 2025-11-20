const express = require('express');
const router = express.Router();
const MateriaController = require('../controllers/materiaController');
const { auth, adminOnly, docenteOnly, estudianteOnly } = require('../middleware/auth');


router.post('/', auth, docenteOnly, MateriaController.crear);
router.get('/', auth, MateriaController.obtenerTodas);
router.get('/:id', auth, MateriaController.obtenerPorId);
router.get('/docente/mis-materias', auth, docenteOnly, MateriaController.obtenerPorDocente);
router.get('/estudiante/mis-materias', auth, estudianteOnly, MateriaController.obtenerMateriasDelEstudiante);
router.post('/matricular', auth, estudianteOnly, MateriaController.matricular);
router.delete('/:id', auth, adminOnly, MateriaController.eliminar);

module.exports = router;

