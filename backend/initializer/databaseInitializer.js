const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function inicializarBaseDatos() {
  try {
    console.log('Inicializando base de datos...');


    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'docente', 'estudiante') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla usuarios creada');


    await db.execute(`
      CREATE TABLE IF NOT EXISTS materias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        horario VARCHAR(255) NOT NULL,
        docente_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (docente_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Tabla materias creada');


    await db.execute(`
      CREATE TABLE IF NOT EXISTS estudiante_materia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        estudiante_id INT NOT NULL,
        materia_id INT NOT NULL,
        fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_matricula (estudiante_id, materia_id),
        FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Tabla estudiante_materia creada');


    await db.execute(`
      CREATE TABLE IF NOT EXISTS pagos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo_pago ENUM('estudiante', 'administrativo') NOT NULL DEFAULT 'estudiante',
        estudiante_id INT NULL,
        materia_id INT NULL,
        docente_id INT NULL,
        monto DECIMAL(10, 2) NOT NULL,
        porcentaje INT NULL,
        descripcion VARCHAR(500) NULL,
        categoria VARCHAR(100) NULL,
        fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
        FOREIGN KEY (docente_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Tabla pagos creada');

    try {

      const [columns] = await db.execute("SHOW COLUMNS FROM pagos LIKE 'tipo_pago'");
      if (columns.length === 0) {
        await db.execute(`
          ALTER TABLE pagos 
          ADD COLUMN tipo_pago ENUM('estudiante', 'administrativo') NOT NULL DEFAULT 'estudiante' AFTER id
        `);
      }

      await db.execute(`ALTER TABLE pagos MODIFY COLUMN estudiante_id INT NULL`);
      await db.execute(`ALTER TABLE pagos MODIFY COLUMN materia_id INT NULL`);
      await db.execute(`ALTER TABLE pagos MODIFY COLUMN porcentaje INT NULL`);


      const [docenteColumns] = await db.execute("SHOW COLUMNS FROM pagos LIKE 'docente_id'");
      if (docenteColumns.length === 0) {
        await db.execute(`ALTER TABLE pagos ADD COLUMN docente_id INT NULL AFTER materia_id`);
        try {
          await db.execute(`
            ALTER TABLE pagos 
            ADD CONSTRAINT fk_docente_pago FOREIGN KEY (docente_id) REFERENCES usuarios(id) ON DELETE CASCADE
          `);
        } catch (fkError) {

        }
      }

      const [descColumns] = await db.execute("SHOW COLUMNS FROM pagos LIKE 'descripcion'");
      if (descColumns.length === 0) {
        await db.execute(`ALTER TABLE pagos ADD COLUMN descripcion VARCHAR(500) NULL AFTER porcentaje`);
      }

      const [catColumns] = await db.execute("SHOW COLUMNS FROM pagos LIKE 'categoria'");
      if (catColumns.length === 0) {
        await db.execute(`ALTER TABLE pagos ADD COLUMN categoria VARCHAR(100) NULL AFTER descripcion`);
      }

      console.log('✓ Tabla pagos actualizada con nuevos campos');
    } catch (error) {
      console.log('Nota: Error al actualizar tabla pagos:', error.message);
    }


    const [existingAdmin] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      ['admin@admin.com']
    );

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await db.execute(
        'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin@admin.com', hashedPassword, 'admin']
      );
      console.log('✓ Usuario admin creado (admin@admin.com / Admin123!)');
    } else {
      console.log('✓ Usuario admin ya existe');
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

module.exports = inicializarBaseDatos;

