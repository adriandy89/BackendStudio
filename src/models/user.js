var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema = Schema({
    usuario: {type: String, required: true},
    nombre: {type: String, required: true},
    apellidos: {type: String, required: true}, 
    password: {type: String, required: true},
    login_count: Number,
    fecha_creacion: Date,
    isAdmin: Boolean
});

module.exports = mongoose.model('User', UserSchema, "users");