const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/pagoController');
const { auth, adminOnly, estudianteOnly, docenteOnly } = require('../middleware/auth');

router.post('/', auth, estudianteOnly, PagoController.crear);
router.get('/', auth, adminOnly, PagoController.obtenerTodos);
router.get('/mis-pagos', auth, estudianteOnly, PagoController.obtenerPorEstudiante);
router.get('/docente/mis-pagos', auth, docenteOnly, PagoController.obtenerPorDocente);
router.get('/materia/:materia_id', auth, PagoController.obtenerPorMateria);
router.get('/total-pagado/:materia_id', auth, estudianteOnly, PagoController.obtenerTotalPagado);

// Pagos administrativos (solo admin)
router.post('/administrativo', auth, adminOnly, PagoController.crearAdministrativo);
router.get('/administrativos', auth, adminOnly, PagoController.obtenerAdministrativos);

module.exports = router;

