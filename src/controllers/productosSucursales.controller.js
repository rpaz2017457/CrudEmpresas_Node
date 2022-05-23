const ProductoSucursales = require('../models/productosSucursales.model');
const Producto = require('../models/productos.model');
const Sucursales = require('../models/sucursales.model');

function simularVenta(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;
    var productoModel = new ProductosSucusales();
    if (req.user.rol == 'Empresa') {
        if (parametros.stock && parametros.nombreSucursal) {
            Producto.findById(idProd, (err, productoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en  la Peticion" });
                if (!productoEncontrado) return res.status(404).send({ mensaje: "Error en la busquedao" });

                productoModel.nombreProducto = productoEncontrado.nombreProducto;
                if (parametros.stock <= 0) return res.status(500).send({ mensaje: "El stock no puede ser menor a 0" })
                if (parametros.stock > productoEncontrado.stock) return res.status(500).send({ mensaje: "No hay esa cantidad de productos" })
                productoModel.stock = parametros.stock;
                Sucursales.find({ nombreSucursal: parametros.nombreSucursal }, (err, sucursalEncontrada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en  la Peticion" });
                    if (!sucursalEncontrada) return res.status(404).send({ mensaje: "Error en la busqueda" });
                    productoModel.idSucursal = sucursalEncontrada[0]._id;
                    ProductoSucursales.find({ idSucursal: productoModel.idSucursal, nombreProducto: productoModel.nombreProducto }, (err, productoEncontrado) => {
                        if (productoEncontrado.length == 0) {
                            Producto.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stock * -1 } }, { new: true }, (err, stockActualizado) => {
                                if (err) return res.status(500).send({ mensaje: "Error en  la Peticion" });
                                if (!stockActualizado) return res.status(404).send({ mensaje: "Error al edutar" })
                                productoModel.save((err, productoGuardado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!productoGuardado) return res.status(400).send({ mensaje: "Error en  la Peticion" });
                                    return res.status(200).send({ producto: productoGuardado });
                                });
                            })
                        } else {
                            Producto.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stock * -1 } }, { new: true }, (err, stockActualizado) => {
                                if (err) return res.status(500).send({ mensaje: "Error en  la Peticion" });
                                if (!stockActualizado) return res.status(404).send({ mensaje: "Error al eeditar" })
                                ProductoSucursales.findOneAndUpdate({ idSucursal: productoModel.idSucursal, nombreProducto: productoModel.nombreProducto }, { $inc: { stock: parametros.stock } },
                                    { new: true }, (err, stockSActualizado) => {
                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                        if (!stockSActualizado) return res.status(400).send({ mensaje: "Error en  la Peticion" });
                                        return res.status(200).send({ producto: stockSActualizado });
                                    });
                            })
                        }
                    });
                })
            })
        } else {
            return res.status(500).send({ mensaje: "Llena todos los campos" })
        }
    }
}

function listarProductosSucursales(req, res) {
    var idSucursal = req.params.idSucursal;
    if (req.user.rol == 'Empresa') {
        ProductoSucursales.find({ idSucursal: idSucursal }, (err, productosSucursales) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productosSucursales) return res.status(500).send({ mensaje: "Error en la busqueda" });

            return res.status(200).send({ productos: productosSucursales });
        })
    }
}

function editarStockProductosSucursales(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;
    if (req.user.rol == 'Empresa') {
        if (parametros.stock) {
            if (parametros.stock <= 0) return res.status(500).send({ mensaje: "El stock no puede ser menor que 0" })
            ProductoSucursales.findById(idProd, (err, productoEncontrado) => {
                if (parametros.stock > productoEncontrado.stock) return res.status(500).send({ mensaje: "No hay esa cantidad de productos" });
                ProductoSucursales.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stock * -1 } }, { new: true }, (err, stockSActualizado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!stockSActualizado) return res.status(400).send({ mensaje: "Error al editar" });
                    return res.status(200).send({ producto: stockSActualizado });
                })
            });
        }
    }
}

function eliminarProductoSucursal(req, res) {
    var idProd = req.params.idProducto;
    if (req.user.rol == 'Empresa') {
        ProductoSucursales.findByIdAndDelete(idProd, (err, productoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoEliminado) return res.status(404).send({ mensaje: "Error al eliminar" });

            return res.status(200).send({ producto: productoEliminado });
        });
    }
}

function obtenerProductoSucursalPorId(req, res) {
    var idProd = req.params.idProducto;

    ProductoSucursales.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!productoEncontrado) return res.status(404).send({ mensaje: "Error en la busqueda" });

        return res.status(200).send({ productos: productoEncontrado });
    });
}

module.exports = {
    simularVenta,
    listarProductosSucursales,
    editarStockProductosSucursales,
    eliminarProductoSucursal,
    obtenerProductoSucursalPorId
}