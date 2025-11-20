const db = require('../config/database');

class Materia {
  static async crear(materia) {
    const { nombre, horario, docente_id } = materia;
    const [result] = await db.execute(
      'INSERT INTO materias (nombre, horario, docente_id) VALUES (?, ?, ?)',
      [nombre, horario, docente_id]
    );
    return result.insertId;
  }

  static async obtenerTodas() {
    const [rows] = await db.execute(
      `SELECT m.id, m.nombre, m.horario, m.docente_id, 
       u.nombre as docente_nombre,
       COUNT(DISTINCT em.estudiante_id) as cantidad_estudiantes
       FROM materias m
       LEFT JOIN usuarios u ON m.docente_id = u.id
       LEFT JOIN estudiante_materia em ON m.id = em.materia_id
       GROUP BY m.id, m.nombre, m.horario, m.docente_id, u.nombre
       ORDER BY m.id DESC`
    );
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.execute(
      `SELECT m.id, m.nombre, m.horario, m.docente_id, 
       u.nombre as docente_nombre,
       COUNT(DISTINCT em.estudiante_id) as cantidad_estudiantes
       FROM materias m
       LEFT JOIN usuarios u ON m.docente_id = u.id
       LEFT JOIN estudiante_materia em ON m.id = em.materia_id
       WHERE m.id = ?
       GROUP BY m.id, m.nombre, m.horario, m.docente_id, u.nombre`,
      [id]
    );
    return rows[0];
  }

  static async obtenerPorDocente(docente_id) {
    const [rows] = await db.execute(
      `SELECT m.id, m.nombre, m.horario, m.docente_id,
       COUNT(DISTINCT em.estudiante_id) as cantidad_estudiantes
       FROM materias m
       LEFT JOIN estudiante_materia em ON m.id = em.materia_id
       WHERE m.docente_id = ?
       GROUP BY m.id, m.nombre, m.horario, m.docente_id
       ORDER BY m.id DESC`,
      [docente_id]
    );
    return rows;
  }

  static async obtenerMateriasDelEstudiante(estudiante_id) {
    const [rows] = await db.execute(
      `SELECT m.id, m.nombre, m.horario, m.docente_id,
       u.nombre as docente_nombre,
       em.fecha_matricula
       FROM materias m
       INNER JOIN estudiante_materia em ON m.id = em.materia_id
       LEFT JOIN usuarios u ON m.docente_id = u.id
       WHERE em.estudiante_id = ?
       ORDER BY em.fecha_matricula DESC`,
      [estudiante_id]
    );
    return rows;
  }

  static async eliminar(id) {
    await db.execute('DELETE FROM materias WHERE id = ?', [id]);
  }
}

module.exports = Materia;

