const db = require('../config/database');

class EstudianteMateria {
  static async matricular(estudiante_id, materia_id) {

    const [existing] = await db.execute(
      'SELECT * FROM estudiante_materia WHERE estudiante_id = ? AND materia_id = ?',
      [estudiante_id, materia_id]
    );

    if (existing.length > 0) {
      throw new Error('El estudiante ya está matriculado en esta materia');
    }

    const [result] = await db.execute(
      'INSERT INTO estudiante_materia (estudiante_id, materia_id, fecha_matricula) VALUES (?, ?, NOW())',
      [estudiante_id, materia_id]
    );
    return result.insertId;
  }

  static async verificarMatricula(estudiante_id, materia_id) {
    const [rows] = await db.execute(
      'SELECT * FROM estudiante_materia WHERE estudiante_id = ? AND materia_id = ?',
      [estudiante_id, materia_id]
    );
    return rows.length > 0;
  }
}

module.exports = EstudianteMateria;

