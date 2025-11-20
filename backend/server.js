require('dotenv').config();

const express = require('express');
const cors = require('cors');
const inicializarBaseDatos = require('./initializer/databaseInitializer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const materiaRoutes = require('./routes/materiaRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/pagos', pagoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API del Instituto funcionando' });
});

inicializarBaseDatos()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  });

