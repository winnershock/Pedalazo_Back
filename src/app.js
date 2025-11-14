const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

//Middlewares
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb'}));

//Rutas
app.use('/api/usuarios', require('./routes/crud.routes'));

module.exports = app