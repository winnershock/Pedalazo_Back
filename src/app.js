require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Carpeta para imágenes
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// =======================
//  RUTAS DEL PROYECTO
// =======================

app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

module.exports = app;