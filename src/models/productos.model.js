const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductosSchema = Schema({
    nombreProducto: String,
    nombreProveedor: String,
    stock: Number,
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'Empresas'}
});

module.exports = mongoose.model('Productos', ProductosSchema)