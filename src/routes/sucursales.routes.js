const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router()

api.get('/sucursales', sucursalesController.obtenerSucursales);
api.post('/sucursales/agregar', md_autenticacion.Auth, sucursalesController.agregarSucursal);
api.put('/editarSucursal/:idSucursal', md_autenticacion.Auth, sucursalesController.editarSucursal);
api.delete('/eliminarSucursal/:idSucursal', md_autenticacion.Auth, sucursalesController.eliminarSucursal);

module.exports = api;