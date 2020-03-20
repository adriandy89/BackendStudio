const Foto = require('../models/fotos');
const error_types = require('./error_types');


let controller = {
    nuevaFoto: (req, res, next) => {
        console.log("caso Nueva Foto");
        console.log(req.user.usuario)        
        Foto.findOne({ dimension: req.body.dimension })
            .then(data => { //si la consulta se ejecuta
                if (data) { //si la foto existe
                    throw new error_types.InfoError("Foto already exists");
                }
                else { //si no existe la  Foto se crea/registra
                    console.log("creando foto");                    
                    let foto =  new Foto({
                        dimension: req.body.dimension,
                        precio: req.body.precio,
                        descripcion: req.body.descripcion,
                        fecha_creacion: Date.now()
                    })
                    return foto.save();
                }
            })
            .then(foto => { //foto registrada con exito, pasamos al siguiente manejador                
                res.json(foto);
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerFoto: (req, res, next) => {
        console.log('caso Obtener Foto');
        Foto.findById(req.params.id)
            .then( foto => { // Si la consulta se ejecuta
                if (!foto) //Si no exite la foto
                    throw new error_types.InfoError('No Existe la foto')
                else{ // Si el contrato existe lo devolvemos
                    res.json(foto)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerFotos: (req, res, next) => {
        console.log('caso Obtener todos las Fotos')
        Foto.find({}).sort({precio:1})
            .then( foto => { // Si se ejecuta la consulta
                if (foto.length < 1) // Si no existen fotos 
                    throw new error_types.InfoError('No Existen Fotos')
                else{ // Si existen contratos los devolvemos
                    res.json(foto)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    modificarFoto: (req, res, next) => {
        console.log("caso Modificar Foto");
        Foto.findByIdAndUpdate(req.params.id, req.body)                     
            .then(data => { //foto Modificada con exito, pasamos al siguiente manejador
                if (!data)//foto No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje:"Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    eliminarFoto: (req, res, next) => {
        console.log("caso Eliminar Foto");
        Foto.findByIdAndRemove(req.params.id)                     
            .then(data => { 
                if (!data)//foto No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje: "Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    }
}

module.exports = controller;