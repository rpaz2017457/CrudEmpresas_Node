const Empresas = require('../models/empresas.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')


function obtenerEmpresas(req, res) {
    Empresas.find((err, EnpresaObtenida) => {
        if (err) return res.send({ mensaje: "Error:" + err })

        return res.send({ empresa: EnpresaObtenida })
    });
}

function Login(req, res) {
    var parametros = req.body;
    Empresas.findOne({ email: parametros.email }, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (empresaEncontrada) {
            bcrypt.compare(parametros.password, empresaEncontrada.password,
                (err, verificacionPassword) => {

                    if (verificacionPassword) {

                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(empresaEncontrada) })
                        } else {
                            empresaEncontrada.password = undefined;
                            return res.status(200)
                                .send({ empresa: empresaEncontrada })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: "La conrraseña no coincide" });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: "El correo no existe." })
        }
    })
}

function agregarEmpresa(req, res) {
    var parametros = req.body;
    var empresasModel = new Empresas();

    if (parametros.nombre && parametros.email && parametros.password) {
        empresasModel.nombre = parametros.nombre;
        empresasModel.email = parametros.email;
        empresasModel.password = parametros.password;
        empresasModel.usuario = parametros.usuario;
        empresasModel.rol = 'Empresa';
        empresasModel.telefono = parametros.telefono
        empresasModel.direccion = parametros.direccion

        Empresas.find({ email: parametros.email }, (err, empresaEncotrada) => {
            if (empresaEncotrada.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    empresasModel.password = passwordEncriptada;

                    empresasModel.save((err, empresaGuardada) => {
                        if (err) return res.status(500)
                            .send({ mensaje: "Error enn la peticion" });
                        if (!empresaGuardada) return res.status(500)
                            .send({ mensaje: "Error al agregar" });

                        return res.status(200).send({ empresa: empresaGuardada });
                    });
                });
            } else {
                return res.status(500)
                    .send({ mensaje: "Este correo esta en uso" });
            }
        })
    }
}

function editarEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        if (parametros.rol) {
            return res.status(500).send({ message: "No puedes editar el Rol" })
        } else {
            Empresas.findByIdAndUpdate({ _id: req.user.sub }, parametros, { new: true }, (err, empresaActualizada) => {
                if (err) return res.status(500).send({ message: "Error en la peticion" });
                if (!empresaActualizada) return res.status(404).send({ message: "Erro en la busqueda" });

                return res.status(200).send({ empresa: empresaActualizada });
            });
        }
    } else {
        Empresas.findById(idEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!empresaEncontrada) return res.status(500).send({ message: "Error en la busqueda" });

            if (empresaEncontrada.rol == 'Empresa') {
                Empresas.findByIdAndUpdate({ _id: idEmpresa }, parametros, { new: true }, (err, empresaActualizada) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion" });
                    if (!empresaActualizada) return res.status(404).send({ message: "Error, no puedes editar" });

                    return res.status(200).send({ empresa: empresaActualizada });
                });
            } else {
                if (idEmpresa == req.user.sub) {
                    if (!parametros.rol) {
                        Empresas.findByIdAndUpdate({ _id: idEmpresa }, parametros, { new: true }, (err, empresaActualizada) => {
                            if (err) return res.status(500).send({ message: "Error en la peticion" });
                            if (!empresaActualizada) return res.status(404).send({ message: "Error, no puedes editar" });

                            return res.status(200).send({ empresa: empresaActualizada });
                        });
                    } else {
                        return res.status(500).send({ mensaje: "No puedes editar el Rol" })
                    }
                } else {
                    return res.status(500).send({ mensaje: "No puedes editar esta empresa" });
                }
            }
        })

    }

}

function eliminarEmpresa(req, res) {
    var idUser = req.params.idEmpresa;

    Empresas.findByIdAndDelete(idUser, (err, empresaEliminada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!empresaEliminada) return res.status(500).send({ mensaje: "Error al eliminar esta empresa" });

        return res.status(200).send({ empresa: empresaEliminada });
    })
}

function usuarioInicial() {
    Empresas.find({ rol: "SuperAdmin", usuario: "SuperAdmin" }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length == 0) {
            bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                Empresas.create({
                    usuario: "SuperAdmin",
                    password: passwordEncriptada,
                    rol: "SuperAdmin",
                })
            })
        }
    })
}

module.exports = {
    obtenerEmpresas,
    agregarEmpresa,
    Login,
    editarEmpresa,
    eliminarEmpresa,
    usuarioInicial,
}