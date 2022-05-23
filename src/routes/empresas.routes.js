const express = require('express');
const empresaControlador = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/Empresa', empresaControlador.obtenerEmpresas);
api.post('/Empresa/registrar', empresaControlador.agregarEmpresa);
api.post('/login', empresaControlador.Login);
api.put('/editarEmpresa/:idEmpresa',md_autenticacion.Auth,  empresaControlador.editarEmpresa);
api.delete('/eliminarEmpresa/:idEmpresa',md_autenticacion.Auth,  empresaControlador.eliminarEmpresa);

module.exports = api;