const User      = require('../models/user');
const bcrypt    = require('bcrypt');
const passport  = require('passport');
const jwt       = require('jsonwebtoken');
const error_types = require('./error_types');

let controller = {
    /*
    Podríamos haber realizado el registro pasando por el middleware de passport, pero no es necesario,
    en este caso se realiza contra una base de datos asi que es muy sencillo hacerlo nosotros.
    */
    register: (req, res, next) => {
        console.log("caso register");
        console.log(req.body.usuario)
        User.findOne({ usuario: req.body.usuario })
            .then(data => { //si la consulta se ejecuta
                if (data) { //si el usuario existe
                    throw new error_types.InfoError("user already exists");
                }
                else { //si no existe el usuario se crea/registra
                    console.log("creando usuario");
                    var hash = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS));
                    let document = new User({
                        usuario: req.body.usuario,
                        nombre: req.body.nombre,
                        apellidos: req.body.apellidos,
                        password: hash,
                        login_count: 0,
                        isAdmin: req.body.isAdmin
                    });
                    return document.save();
                }
            })
            .then(user => { //usuario registrado con exito, pasamos al siguiente manejador
                const dataUser= { 
                    usuario: user.usuario,
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    isAdmin: user.isAdmin 
                }
                res.json({ dataUser });
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    login: (req, res, next) => {
        console.log("caso login");
        console.log(req.body.usuario)
        passport.authenticate("local", { session: false }, (error, user) => {
            console.log("ejecutando *callback auth* de authenticate para estrategia local");

            //si hubo un error en el callback verify relacionado con la consulta de datos de usuario
            if (!user || error) {
                if (error) {
                    if (error.name=="MongooseServerSelectionError") {
                        next(new error_types.Error404("Not connected"))
                    }
                } else {
                    next(new error_types.Error403("username or password not correct."))
                }     
            }else {
                console.log("*** comienza generacion token*****");
                const payload = {
                    sub: user._id,
                    exp: Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_LIFETIME),
                    usuario: user.usuario
                };

                /* NOTA: Si estuviesemos usando sesiones, al usar un callback personalizado, 
                es nuestra responsabilidad crear la sesión.
                Por lo que deberiamos llamar a req.logIn(user, (error)=>{}) aquí*/

                /*solo inficamos el payload ya que el header ya lo crea la lib jsonwebtoken internamente
                para el calculo de la firma y así obtener el token*/
                const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, {algorithm: process.env.JWT_ALGORITHM});
                
                const dataUser= { 
                    usuario: user.usuario,
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    isAdmin: user.isAdmin,                                  
                    accessToken: token,
                    expiresIn: payload.exp
                }
                res.json({dataUser});
            }
           
        })(req, res);
    },
    obtenerUsuarios: (req, res, next) => {
        console.log('caso Obtener todos los Usuarios')
        User.find({},{'password':0}).sort({usuario:1})
            .then( data => { // Si se ejecuta la consulta
                if (data.length < 1) // Si no existen Usuarios 
                    throw new error_types.InfoError('No Existen Usuarios')
                else{ // Si existen usuarios los devolvemos
                    res.json(data)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    obtenerUsuario: (req, res, next) => {
        console.log('caso Obtener Usuario')
        User.findById(req.params.id,{'password':0})
            .then( data => { // Si se ejecuta la consulta
                if (data.length < 1) // Si no existe Usuario 
                    throw new error_types.InfoError('No Existe Usuario')
                else{ // Si existen usuarios los devolvemos
                    res.json(data)
                }
            })
            .catch( err => {
                //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    modificarModificar: (req, res, next) => {
        console.log("caso Modificar Usuario");
        if (req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS));
        }
        User.findByIdAndUpdate(req.params.id, req.body)                     
            .then(data => { //Usuario Modificado con exito, pasamos al siguiente manejador
                if (!data)//Usuario No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje:"Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    eliminarUsuario: (req, res, next) => {
        console.log("caso Eliminar Usuario");
        User.findByIdAndRemove(req.params.id)                     
            .then(data => { 
                if (!data)//Usuario No existe
                    res.json({mensaje: "Error"})
                res.json({mensaje: "Ok"})              
            })    
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    }
}

module.exports = controller;