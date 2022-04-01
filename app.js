const express = require('express');
const cors = require('cors');
var app = express();

const EmpresasRutas = require('./src/routes/empresas.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', EmpresasRutas);

module.exports = app;