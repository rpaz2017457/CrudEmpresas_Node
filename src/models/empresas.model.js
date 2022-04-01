const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresasSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    telefono: String,
    direccion: String,
});

module.exports = mongoose.model('Empresas', EmpresasSchema);