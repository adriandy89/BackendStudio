const Accesorio = require('../models/accesorios');
const error_types = require('./error_types');


let controller = {
    nuevoAccesorio: (req, res, next) => {
        console.log("caso Nuevo Accesorio");
        console.log(req.user.usuario)        
        Accesorio.findOne({ tipo: req.body.tipo })
            .then(data => { //si la consulta se ejecuta
                if (data) { //si el Accesorio existe
                    throw new error_types.InfoError("Accesorio already exists");
                }
                else { //si no existe la  Foto se crea/registra
                    console.log("creando Accesorio");                    
                    let accesorio =  new Accesorio({
                        tipo: req.body.tipo,
                        precio: req.body.precio,
                        descripcion: req.body.descripcion,
                        fecha_creacion: Date.now()
                    })
                    return accesorio.save();
                }
            })
            .then(accesorio => { //Accesorio registrado con exito, pasamos al siguiente manejador                
                res.json(accesorio);
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerAccesorio: (req, res, next) => {
        console.log('caso Obtener Accesorio');
        Accesorio.findById(req.params.id)
            .then( accesorio => { // Si la consulta se ejecuta
                if (!accesorio) //Si no exite el Accesorio
                    throw new error_types.InfoError('No Existe el Accesorio')
                else{ // Si el Accesorio existe lo devolvemos
                    res.json(accesorio)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerAccesorios: (req, res, next) => {
        console.log('caso Obtener todos los Accesorio')
        Accesorio.find({})
            .then( accesorio => { // Si se ejecuta la consulta
                if (accesorio.length < 1) // Si no existen Accesorio 
                    throw new error_types.InfoError('No Existen Accesorios')
                else{ // Si existen Accesorios los devolvemos
                    res.json(accesorio)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    modificarAccesorio: (req, res, next) => {
        console.log("caso Modificar Accesorio");
        Accesorio.findByIdAndUpdate(req.params.id, req.body)                     
            .then(data => { //Accesorio Modificada con exito, pasamos al siguiente manejador
                if (!data)//Accesorio No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje:"Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    eliminarAccesorio: (req, res, next) => {
        console.log("caso Eliminar Accesorio");
        Accesorio.findByIdAndRemove(req.params.id)                     
            .then(data => { 
                if (!data)//Accesorio No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje: "Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    }
}

module.exports = controller;