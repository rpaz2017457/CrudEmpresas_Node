const express = require('express');
const productosController = require('../controllers/productos.controller');
const md_autenticacion =  require('../middlewares/autenticacion');

const api = express.Router()

api.get('/productos', productosController.obtenerProductos);
api.post('/productos/agregar', md_autenticacion.Auth,  productosController.agregarProducto);
api.put('/editarProducto/:idProducto',md_autenticacion.Auth, productosController.editarProducto);
api.delete('/eliminarProducto/:idProducto', md_autenticacion.Auth,productosController.eliminarProducto);
 
module.exports = api;