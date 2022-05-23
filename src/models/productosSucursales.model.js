const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var ProductosSucursalesSchema = Schema({
    nombreProductoSucursal: String,
    stockSucursal: Number,
    vendido: Number,
    idSucursal: { type: Schema.Types.ObjectId, ref: 'Sucursales'}

})

module.exports=mongoose.model('ProductoSucursales',ProductosSucursalesSchema)