const Contrato = require('../models/contratos');
const error_types = require('./error_types');


let controller = {
    nuevoContrato: (req, res, next) => {
        console.log("caso Nuevo contrato");
        console.log(req.user.usuario)        
        Contrato.findOne({ numero_contrato: req.body.numero_contrato })
            .then(data => { //si la consulta se ejecuta
                if (data) { //si el contrato existe
                    throw new error_types.InfoError("contrato already exists");
                }
                else { //si no existe el contrato se crea/registra
                    console.log("creando contrato");
                    fecha_c= new Date(Date.now()),
                    fecha_c.setHours(0, 0, 0, 0);                    
                    let contrato =  new Contrato({
                        fecha_creado: fecha_c,                        
                        fecha_modificado: req.body.fecha_modificado,
                        fecha_terminado: req.body.fecha_terminado,
                        fecha_entrega: req.body.fecha_entrega,
                        hora_cita:req.body.hora_cita,
                        fecha_cita:req.body.fecha_cita,
                        numero_contrato: req.body.numero_contrato,
                        ci: req.body.ci,
                        nombre: req.body.nombre,
                        apellidos: req.body.apellidos,
                        edad: req.body.edad,
                        telefono: req.body.telefono,                        
                        tipo_contrato: req.body.tipo_contrato,
                        fotos: req.body.fotos,
                        accesorios: req.body.accesorios,
                        precio: req.body.precio,
                        adelanto: req.body.adelanto,
                        estado: req.body.estado
                    })
                    return contrato.save();
                }
            })
            .then(contrato => { //contrato registrado con exito, pasamos al siguiente manejador                
                res.json(contrato);
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerContrato: (req, res, next) => {
        console.log('caso Obtener Contrato');
        Contrato.findById(req.params.id)
            .then( contrato => { // Si la consulta se ejecuta
                if (!contrato) //Si no exite el contrato
                    throw new error_types.InfoError('No Existe el Contrato')
                else{ // Si el contrato existe lo devolvemos
                    res.json(contrato)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerContratos: (req, res, next) => {
        console.log('caso Obtener todos los Contratos')
        Contrato.find({}).sort({fecha_cita:1}).sort({hora_cita:1})
            .then( contratos => { // Si se ejecuta la consulta
                if (contratos.length < 1) // Si no existen Contratos 
                    throw new error_types.InfoError('No Existen Contratos')
                else{ // Si existen contratos los devolvemos
                    res.json(contratos)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },    
    obtenerEstadisticas: (req, res, next) => {
        console.log('caso Obtener Estadisticas')
        Contrato.find({$or:[{fecha_creado:{$gte:req.body.fecha_cita,$lte:req.body.fecha_cita2}},{fecha_entregado:{$gte:req.body.fecha_cita,$lte:req.body.fecha_cita2}}]}, 
            {'_id':0, 'estado':1, 'fecha_terminado':1, 'fecha_entregado':1, 'fecha_creado':1, 'fecha_creado':1, 'precio':1, 'adelanto':1})
            .sort({fecha_creado:1})
            .then( contratos => { // Si se ejecuta la consulta
                if (contratos.length < 1) // Si no existen Contratos 
                    throw new error_types.InfoError('No Existen Contratos')
                else{ // Si existen contratos los devolvemos
                    ingresos=0
                    total= contratos.length
                    pendientes=0
                    terminados=0
                    entregados=0
                    nuevos=0
                    contratos.forEach(contrato => {
                        if (contrato.fecha_entregado) {
                            if (new Date(contrato.fecha_creado)>=new Date(req.body.fecha_cita) 
                            && new Date(contrato.fecha_entregado)<=new Date(req.body.fecha_cita2)) {
                                ingresos+=(contrato.precio)
                                nuevos++
                            } else if (new Date(contrato.fecha_creado)<=new Date(req.body.fecha_cita)) {
                                ingresos+=(contrato.precio-contrato.adelanto)
                            } else if (new Date(contrato.fecha_entregado)>=new Date(req.body.fecha_cita2)) {
                                ingresos+=(contrato.adelanto)
                            }
                        } else {
                            ingresos+=(contrato.adelanto)
                            nuevos++
                        }
                        switch (contrato.estado) {
                            case "Pendiente":
                                pendientes++
                                break;
                            case "Terminado":
                                terminados++
                                break;
                            case "Entregado":
                                entregados++
                                break;                        
                            default:
                                break;
                        }                        
                    });                    
                    res.json({total, ingresos, pendientes, terminados, entregados, nuevos})
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerContratosPendientes: (req, res, next) => {
        console.log('caso Obtener Contratos Pendientes');
        Contrato.find({estado:"Pendiente", fecha_cita:req.body.fecha_cita}).sort({hora_cita:1})
            .then( contrato => { // Si la consulta se ejecuta
                if (!contrato) //Si no exiten contratos
                    throw new error_types.InfoError('No Existe el Contrato')
                else{ // Si contratos existen los devolvemos
                    res.json(contrato)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerContratosPendientesIntervalo: (req, res, next) => {
        console.log('caso Obtener Contratos Pendientes');
        Contrato.find({estado:"Pendiente", fecha_cita:{$gte:req.body.fecha_cita,$lte:req.body.fecha_cita2}}).sort({fecha_cita:1}).sort({hora_cita:1})
            .then( contrato => { // Si la consulta se ejecuta
                if (!contrato) //Si no exiten contratos
                    throw new error_types.InfoError('No Existe el Contrato')
                else{ // Si contratos existen los devolvemos
                    res.json(contrato)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerContratosIntervalo: (req, res, next) => {
        console.log('caso Obtener Contratos Pendientes');
        Contrato.find({fecha_cita:{$gte:req.body.fecha_cita,$lte:req.body.fecha_cita2}}).sort({fecha_cita:1}).sort({hora_cita:1})
            .then( contrato => { // Si la consulta se ejecuta
                if (!contrato) //Si no exiten contratos
                    throw new error_types.InfoError('No Existe el Contrato')
                else{ // Si contratos existen los devolvemos
                    res.json(contrato)
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    modificarContrato: (req, res, next) => {
        console.log("caso Modificar contrato");
        Contrato.findByIdAndUpdate(req.params.id, req.body)                     
            .then(data => { //contrato Modificado con exito, pasamos al siguiente manejador
                if (!data)//contrato No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje:"Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    eliminarContrato: (req, res, next) => {
        console.log("caso Eliminar contrato");
        Contrato.findByIdAndRemove(req.params.id)                     
            .then(data => { 
                if (!data)//contrato No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje: "Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerHoraTipoNombrePorFechaCita: (req, res, next) => {
        console.log('caso Obtener todos Hora Tipo Nombre Por FechaCita')
        Contrato.find({fecha_cita:req.body.fecha_cita}, {'_id':0, 'hora_cita':1, 'nombre': 1, 'tipo_contrato':1}).sort({hora_cita:1})
            .then( contratos => { // Si se ejecuta la consulta
                if (contratos.length < 1) // Si no existen Contratos 
                    throw new error_types.InfoError('No Existen Contratos')
                else{ // Si existen contratos los devolvemos
                    res.json(contratos)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerNuevoNumeroContrato: (req, res, next) => {
        console.log('caso Obtener Nuevo Numero de Contrato')
        Contrato.find({}, {'_id':0, 'numero_contrato':1}).sort({$natural:-1}).limit(1)
            .then( contrato => { // Si la consulta se ejecuta                
                if (contrato.length < 1) //Si no exiten contratos
                    { res.json({numero_contrato: 0})}
                else{ // Si existen contratos devolvemos el Numero del  Ultimo
                    console.log(contrato[0].numero_contrato)
                    res.json({numero_contrato: contrato[0].numero_contrato})
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    }
}

module.exports = controller;