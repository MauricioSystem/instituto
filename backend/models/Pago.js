const db = require('../config/database');

class Pago {
  static async crear(pago) {
    const { tipo_pago, estudiante_id, materia_id, docente_id, monto, porcentaje, descripcion, categoria } = pago;
    const [result] = await db.execute(
      'INSERT INTO pagos (tipo_pago, estudiante_id, materia_id, docente_id, monto, porcentaje, descripcion, categoria, fecha_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [tipo_pago || 'estudiante', estudiante_id || null, materia_id || null, docente_id || null, monto, porcentaje || null, descripcion || null, categoria || null]
    );
    return result.insertId;
  }

  static async crearAdministrativo(pago) {
    const { docente_id, monto, descripcion, categoria } = pago;
    const [result] = await db.execute(
      'INSERT INTO pagos (tipo_pago, docente_id, monto, descripcion, categoria, fecha_pago) VALUES (?, ?, ?, ?, ?, NOW())',
      ['administrativo', docente_id || null, monto, descripcion, categoria]
    );
    return result.insertId;
  }

  static async obtenerTodos() {
    const [rows] = await db.execute(
      `SELECT p.id, p.tipo_pago, p.monto, p.porcentaje, p.descripcion, p.categoria, p.fecha_pago,
       u.nombre as estudiante_nombre, u.email as estudiante_email,
       m.nombre as materia_nombre,
       d.nombre as docente_nombre
       FROM pagos p
       LEFT JOIN usuarios u ON p.estudiante_id = u.id
       LEFT JOIN materias m ON p.materia_id = m.id
       LEFT JOIN usuarios d ON p.docente_id = d.id
       ORDER BY p.fecha_pago DESC`
    );
    return rows;
  }

  static async obtenerPorEstudiante(estudiante_id) {
    const [rows] = await db.execute(
      `SELECT p.id, p.monto, p.porcentaje, p.fecha_pago,
       m.nombre as materia_nombre
       FROM pagos p
       INNER JOIN materias m ON p.materia_id = m.id
       WHERE p.estudiante_id = ?
       ORDER BY p.fecha_pago DESC`,
      [estudiante_id]
    );
    return rows;
  }

  static async obtenerPorMateria(materia_id) {
    const [rows] = await db.execute(
      `SELECT p.id, p.monto, p.porcentaje, p.fecha_pago,
       u.nombre as estudiante_nombre, u.email as estudiante_email
       FROM pagos p
       INNER JOIN usuarios u ON p.estudiante_id = u.id
       WHERE p.materia_id = ?
       ORDER BY p.fecha_pago DESC`,
      [materia_id]
    );
    return rows;
  }

  static async obtenerPorDocente(docente_id) {
    const [rows] = await db.execute(
      `SELECT p.id, p.monto, p.porcentaje, p.fecha_pago,
       u.nombre as estudiante_nombre, u.email as estudiante_email,
       m.nombre as materia_nombre
       FROM pagos p
       INNER JOIN usuarios u ON p.estudiante_id = u.id
       INNER JOIN materias m ON p.materia_id = m.id
       WHERE m.docente_id = ?
       ORDER BY p.fecha_pago DESC`,
      [docente_id]
    );
    return rows;
  }

  static async obtenerTotalPagadoPorMateria(estudiante_id, materia_id) {
    const [rows] = await db.execute(
      'SELECT COALESCE(SUM(porcentaje), 0) as total_porcentaje FROM pagos WHERE estudiante_id = ? AND materia_id = ? AND tipo_pago = "estudiante"',
      [estudiante_id, materia_id]
    );

    return Number(rows[0].total_porcentaje) || 0;
  }

  static async obtenerAdministrativos() {
    const [rows] = await db.execute(
      `SELECT p.id, p.monto, p.descripcion, p.categoria, p.fecha_pago,
       d.nombre as docente_nombre
       FROM pagos p
       LEFT JOIN usuarios d ON p.docente_id = d.id
       WHERE p.tipo_pago = 'administrativo'
       ORDER BY p.fecha_pago DESC`
    );
    return rows;
  }
}

module.exports = Pago;

