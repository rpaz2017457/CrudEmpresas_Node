const mongoose = require('mongoose');
const app = require('./app');
const usuarioControlador = require('./src/controllers/empresas.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SucursalesEmpresas', { useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    console.log("Se encuentra dentro a la base de datos");
    app.listen(3000, function() {
        console.log("hola mundo, estoy en el puerto 3000!")
    })
}).catch(error => console.log(error))

usuarioControlador.usuarioInicial()