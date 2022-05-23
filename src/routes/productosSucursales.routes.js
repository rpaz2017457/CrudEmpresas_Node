const express = require('express');
const productoSucursalesControlador = require('../controllers/productosSucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.put('/productosSucursales/Venta/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.simularVenta);
api.get('/productosSucursales/verProductos/:idSucursal', md_autenticacion.Auth, productoSucursalesControlador.listarProductosSucursales);
api.put('/productosSucursales/editarProductoSucursal/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.editarStockProductosSucursales);
api.delete('/productosSucursales/eliminarProductosSucursales/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.eliminarProductoSucursal);

module.exports = api;