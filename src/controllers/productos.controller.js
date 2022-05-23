const Productos = require('../models/productos.model');

function obtenerProductos(req, res) {
    Productos.find((err, productosObtenidos) => {
        if (err) return res.send({ mensaje: "Error:" + err })

        return res.send({ producto: productosObtenidos })
    });
}


function agregarProducto(req, res) {
    var parametros = req.body;
    console.log(parametros);
    var ProductosModel = new Productos();
    if (req.user.rol == 'Admin') {
        return res.status(500).send({ message: 'Eres Admin, no puedes realizar Cambios' });
    } else {
        if (parametros.nombreProducto && parametros.nombreProveedor && parametros.stock) {
            ProductosModel.nombreProducto = parametros.nombreProducto;
            ProductosModel.nombreProveedor = parametros.nombreProveedor;
            ProductosModel.stock = parametros.stock;
            if (parametros.stock == 0) {
                ProductosModel.stock = 0;
            } else {
                ProductosModel.stock = parametros.stock;
            }

            ProductosModel.idEmpresa = req.user.sub;

            Productos.find({ nombreProducto: parametros.nombreProducto, idEmpresa: req.user.sub }, (err, productoEncontrado) => {
                if (productoEncontrado == 0) {
                    ProductosModel.save((err, ProductoGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });
                        if (!ProductoGuardado) return res.status(404).send({ message: 'No se encontraron productos para esta empresa' });
                        console.log(productoEncontrado)
                        return res.status(200).send({ Productos: ProductoGuardado });
                    });
                } else {
                    return res.status(500).send({ message: 'Este producto existe' })
                }
            });

        } else {
            console.log('no se guarda')
            return res.status(500).send({ message: 'Error en la peticion' });
        }
    }

}


function editarProducto(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        return res.status(500).send({ mensaje: "No eres Admin, no puedes realizar esta accion" });
    } else {
        Productos.findByIdAndUpdate(idProd, parametros, { new: true }, (err, productoActualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoActualizado) return res.status(404).send({ mensaje: "Error al editar" });

            return res.status(200).send({ producto: productoActualizado });
        })

    }
}

function eliminarProducto(req, res) {
    var idProd = req.params.idProducto;
    if (req.user.rol == 'Empresa') {
        return res.status(500).send({ mensaje: "No eres Admin, no puedes realizar esta accion" });
    } else {
        Productos.findByIdAndDelete(idProd, (err, productoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoEliminado) return res.status(404).send({ mensaje: "Error al eliminar" });

            return res.status(200).send({ producto: productoEliminado });
        })
    }
}
module.exports = {
    obtenerProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto
}