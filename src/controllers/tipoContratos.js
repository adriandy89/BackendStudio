const TipoContrato = require('../models/tipoContratos');
const Foto = require('../models/fotos');
const Accesorio = require('../models/accesorios');
const error_types = require('./error_types');


let controller = {
    nuevoTipoContrato: (req, res, next) => {
        console.log("caso Nuevo TipoContrato");
        console.log(req.user.usuario)        
        TipoContrato.findOne({ tipo: req.body.tipo })
            .then(async (data) => { //si la consulta se ejecuta
                if (data) { //si el TipoContrato existe
                    throw new error_types.InfoError("Tipo de Contrato already exists");
                }
                else { //si no existe el TipoContrato se crea/registra
                    console.log("creando TipoContrato");                    
                    let tipoContrato =  new TipoContrato({
                        tipo: req.body.tipo,
                        precio: req.body.precio,
                        descripcion: req.body.descripcion,
                        fecha_creacion: Date.now()
                    })
                    if (req.body.fotos) {
                        let arregloFotos = req.body.fotos                    
                        for (let i = 0; i < arregloFotos.length; i++) {
                            tipoContrato.fotos.push({
                                cantidad: arregloFotos[i].cantidad, 
                                tipoFotos: await Foto.findById(arregloFotos[i].fotoId)
                            })
                        }
                    }      
                    
                    if (req.body.accesorios) {
                        let arregloAccesorios = req.body.accesorios                    
                        for (let i = 0; i < arregloAccesorios.length; i++) {
                            tipoContrato.accesorios.push({
                                cantidad: arregloAccesorios[i].cantidad, 
                                tipoAccesorios: await Accesorio.findById(arregloAccesorios[i].accesorioId)
                            })
                        }      
                    }                                                
                    return tipoContrato.save();
                }
            })
            .then(async (tipoContrato) => { //TipoContrato registrado con exito, pasamos al siguiente manejador  
                if (req.body.accesorios) {
                    let arregloAccesorios = req.body.accesorios                                    
                    for (let i = 0; i < arregloAccesorios.length; i++) {
                        let accesorio = await Accesorio.findById(arregloAccesorios[i].accesorioId) 
                        if (!accesorio)//TipoContrato No existe
                            res.json({mensaje: "Creado con Error en Accesorio"})
                        accesorio.tipoContrato.push(tipoContrato._id)
                        await Accesorio.findByIdAndUpdate(arregloAccesorios[i].accesorioId, accesorio)
                    }
                }
                if (req.body.fotos) {
                    let arregloFotos = req.body.fotos                                    
                    for (let i = 0; i < arregloFotos.length; i++) {
                        let foto = await Foto.findById(arregloFotos[i].fotoId) 
                        if (!foto)//TipoContrato No existe
                            res.json({mensaje: "Creado con Error en Foto"})
                            foto.tipoContrato.push(tipoContrato._id)
                        await Foto.findByIdAndUpdate(arregloFotos[i].fotoId, foto)
                    }
                }     
                res.json(tipoContrato);
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },    
    obtenerTipoContrato:  (req, res, next) => {
        console.log('caso Obtener TipoContrato');
        TipoContrato.findById(req.params.id)
            .then( tipoContrato => { // Si la consulta se ejecuta
                if (!tipoContrato) //Si no exite la foto
                    throw new error_types.InfoError('No Existe el TipoContrato')
                else{ // Si el contrato existe lo devolvemos
                    res.json(tipoContrato)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerTipoContratos: (req, res, next) => {
        console.log('caso Obtener todos los tipoContratos')
        TipoContrato.find({}).populate("fotos.tipoFotos").populate("accesorios.tipoAccesorios")
            .then( tipoContrato => { // Si se ejecuta la consulta
                if (tipoContrato.length < 1) // Si no existen tipoContratos 
                    throw new error_types.InfoError('No Existen tipos de Contratos')
                else{ // Si existen tipoContratos los devolvemos
                    res.json(tipoContrato)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    modificarTipoContrato: (req, res, next) => {
        console.log("caso Modificar TipoContrato");
        TipoContrato.findByIdAndRemove(req.params.id)                     
            .then(async (tipoContratoEliminado) => { 
                if (!tipoContratoEliminado)//TipoContrato No existe
                    res.json({mensaje: "Error"})
                let arregloAccesorios = tipoContratoEliminado.accesorios                                    
                for (let i = 0; i < arregloAccesorios.length; i++) {
                    let accesorio = await Accesorio.findById(arregloAccesorios[i].tipoAccesorios) 
                    if (!accesorio)//TipoContrato No existe
                        res.json({mensaje: "Eliminado con Error en Accesorio"})
                    let nuevoArreglo = []
                    for (let j = 0; j < accesorio.tipoContrato.length; j++) {
                        if (accesorio.tipoContrato[j] != tipoContratoEliminado._id.toString() ) {
                            nuevoArreglo.push(accesorio.tipoContrato[j])
                        }                        
                    }
                    accesorio.tipoContrato = nuevoArreglo
                    await Accesorio.findByIdAndUpdate(arregloAccesorios[i].tipoAccesorios, accesorio)                
                }
                let arregloFotos = tipoContratoEliminado.fotos                                    
                for (let i = 0; i < arregloFotos.length; i++) {
                    let foto = await Foto.findById(arregloFotos[i].tipoFotos) 
                    if (!foto)//TipoContrato No existe
                        res.json({mensaje: "Eliminado con Error en Foto"})
                    let nuevoArreglo = []
                    for (let j = 0; j < foto.tipoContrato.length; j++) {
                        if (foto.tipoContrato[j] != tipoContratoEliminado._id.toString() ) {
                            nuevoArreglo.push(foto.tipoContrato[j])
                        }                        
                    }
                    foto.tipoContrato = nuevoArreglo
                    await Foto.findByIdAndUpdate(arregloFotos[i].tipoFotos, foto)                
                }
                let data= await TipoContrato.findOne({ tipo: req.body.tipo })           
                if (data) { //si el TipoContrato existe
                    throw new error_types.InfoError("Tipo de Contrato already exists");
                }
                else { //si no existe el TipoContrato se crea/registra
                    console.log("creando TipoContrato");                    
                    let tipoContrato =  new TipoContrato({
                        tipo: req.body.tipo,
                        precio: req.body.precio,
                        descripcion: req.body.descripcion,
                        fecha_creacion: Date.now()
                    })
                    if (req.body.fotos) {
                        let arregloFotos = req.body.fotos                    
                        for (let i = 0; i < arregloFotos.length; i++) {
                            tipoContrato.fotos.push({
                                cantidad: arregloFotos[i].cantidad, 
                                tipoFotos: await Foto.findById(arregloFotos[i].fotoId)
                            })
                        }
                    }      
                    
                    if (req.body.accesorios) {
                        let arregloAccesorios = req.body.accesorios                    
                        for (let i = 0; i < arregloAccesorios.length; i++) {
                            tipoContrato.accesorios.push({
                                cantidad: arregloAccesorios[i].cantidad, 
                                tipoAccesorios: await Accesorio.findById(arregloAccesorios[i].accesorioId)
                            })
                        }      
                    }                                                
                    return tipoContrato.save();
                }               
            })
            .then(async (tipoContrato) => { //TipoContrato registrado con exito, pasamos al siguiente manejador  
                if (req.body.accesorios) {
                    let arregloAccesorios = req.body.accesorios                                    
                    for (let i = 0; i < arregloAccesorios.length; i++) {
                        let accesorio = await Accesorio.findById(arregloAccesorios[i].accesorioId) 
                        if (!accesorio)//TipoContrato No existe
                            res.json({mensaje: "Creado con Error en Accesorio"})
                        accesorio.tipoContrato.push(tipoContrato._id)
                        await Accesorio.findByIdAndUpdate(arregloAccesorios[i].accesorioId, accesorio)
                    }
                }
                if (req.body.fotos) {
                    let arregloFotos = req.body.fotos                                    
                    for (let i = 0; i < arregloFotos.length; i++) {
                        let foto = await Foto.findById(arregloFotos[i].fotoId) 
                        if (!foto)//TipoContrato No existe
                            res.json({mensaje: "Creado con Error en Foto"})
                            foto.tipoContrato.push(tipoContrato._id)
                        await Foto.findByIdAndUpdate(arregloFotos[i].fotoId, foto)
                    }
                }     
                res.json(tipoContrato);
            })                
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })         
    },
    eliminarTipoContrato: (req, res, next) => {
        console.log("caso Eliminar TipoContrato");
        TipoContrato.findByIdAndRemove(req.params.id)                     
            .then(async (tipoContratoEliminado) => { 
                if (!tipoContratoEliminado)//TipoContrato No existe
                    res.json({mensaje: "Error"})
                let arregloAccesorios = tipoContratoEliminado.accesorios                                    
                for (let i = 0; i < arregloAccesorios.length; i++) {
                    let accesorio = await Accesorio.findById(arregloAccesorios[i].tipoAccesorios) 
                    if (!accesorio)//TipoContrato No existe
                        res.json({mensaje: "Eliminado con Error en Accesorio"})
                    let nuevoArreglo = []
                    for (let j = 0; j < accesorio.tipoContrato.length; j++) {
                        if (accesorio.tipoContrato[j] != tipoContratoEliminado._id.toString() ) {
                            nuevoArreglo.push(accesorio.tipoContrato[j])
                        }                        
                    }
                    accesorio.tipoContrato = nuevoArreglo
                    await Accesorio.findByIdAndUpdate(arregloAccesorios[i].tipoAccesorios, accesorio)                
                }
                let arregloFotos = tipoContratoEliminado.fotos                                    
                for (let i = 0; i < arregloFotos.length; i++) {
                    let foto = await Foto.findById(arregloFotos[i].tipoFotos) 
                    if (!foto)//TipoContrato No existe
                        res.json({mensaje: "Eliminado con Error en Foto"})
                    let nuevoArreglo = []
                    for (let j = 0; j < foto.tipoContrato.length; j++) {
                        if (foto.tipoContrato[j] != tipoContratoEliminado._id.toString() ) {
                            nuevoArreglo.push(foto.tipoContrato[j])
                        }                        
                    }
                    foto.tipoContrato = nuevoArreglo
                    await Foto.findByIdAndUpdate(arregloFotos[i].tipoFotos, foto)                
                }
                res.json({mensaje: "Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    }
}

module.exports = controller;