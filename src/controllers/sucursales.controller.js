const Sucursales = require('../models/sucursales.model');

function obtenerSucursales (req, res) {
    Sucursales.find((err, sucursalesObtenidas) => {
        if (err) return res.send({ mensaje: "Error:" + err })

        return res.send({ sucursal: sucursalesObtenidas })
    });
}

function agregarSucursal(req, res){

    if(req.user.rol == 'Empresa') return res.status(500).send({mensaje: "No eres empresa, no puedes realizar cambios"})
    var parametros = req.body;
    var sucursalModel = new Sucursales();
    if(parametros.nombreSucursal && parametros.direccionSucursal){

        sucursalModel.nombreSucursal = parametros.nombreSucursal;
        sucursalModel.direccionSucursal = parametros.direccionSucursal;
        sucursalModel.idEmpresa = req.user.sub;


        Sucursales.findOne({nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub}, (err, sucursalEncontrada)=>{

            Sucursales.findOne({direccionSucursal: parametros.direccionSucursal, idEmpresa: req.user.sub}, (err, direccionEncontrada)=>{

                if(sucursalEncontrada != null || direccionEncontrada != null) {
                    return res.status(500).send({Message: 'Esta sucursal ya existe, ingrese otros datos para agregar'})

                }else{
                    sucursalModel.save((err, SucursalGuardada)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
                        if(!SucursalGuardada) return res.status(404).send({message: 'No se han podido guardar los datos'});
                        
                        return res.status(200).send({sucursal: SucursalGuardada});
                    });                }
            });

        });
        
    }else{
        return res.status(200).send({message:'Debe llenar los campos solicitados'});
    }
}

function editarSucursal(req, res) {
    var idSucursal = req.params.idSucursal;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        return res.status(500).send({ mensaje: "No eres Admin, no puedes realizar esta accion"  });
    } else {
        Sucursales.findByIdAndUpdate(idSucursal, parametros, { new: true }, (err, sucursalActualizada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!sucursalActualizada) return res.status(500).send({ mensaje: "Error al editar" });

            return res.status(200).send({ sucursal: sucursalActualizada });
        })
    }
}

function eliminarSucursal(req, res) {
    
    var idSucursal = req.params.idSucursal;
    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: "No eres Admin, no puedes realizar esta accion" });
    }else{
        Sucursales.findByIdAndDelete(idSucursal, (err, sucursalEliminada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!sucursalEliminada) return res.status(404).send( { mensaje: "Error al eliminar"});
    
            return res.status(200).send({ sucursal: sucursalEliminada});
        })
    }
}


module.exports = {
    obtenerSucursales,
    agregarSucursal,
    eliminarSucursal,
    editarSucursal 
}