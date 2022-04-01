const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta';

exports.crearToken = function (empresa) {
    let payload = {
        sub: empresa._id,
        nombre: empresa.nombre,
        email: empresa.email,
        rol: empresa.rol,
        iat: moment().unix(),
        exp: moment().day(7, 'days').unix()
    }
    return jwt_simple.encode(payload, secret);
}