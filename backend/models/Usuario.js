const db = require('../config/database');

class Usuario {
  static async crear(usuario) {
    const { nombre, email, password, rol } = usuario;
    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password, rol]
    );
    return result.insertId;
  }

  static async buscarPorEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async buscarPorId(id) {
    const [rows] = await db.execute(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async obtenerTodos() {
    const [rows] = await db.execute(
      'SELECT id, nombre, email, rol FROM usuarios ORDER BY id DESC'
    );
    return rows;
  }

  static async obtenerPorRol(rol) {
    const [rows] = await db.execute(
      'SELECT id, nombre, email, rol FROM usuarios WHERE rol = ?',
      [rol]
    );
    return rows;
  }

  static async eliminar(id) {
    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  }
}

module.exports = Usuario;

