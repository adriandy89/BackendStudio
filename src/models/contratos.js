var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ContratoSchema = Schema({
    fecha_creado: Date,
    fecha_modificado: Date,
    fecha_terminado: Date,
    fecha_entrega: Date,
    fecha_entregado: Date,
    fecha_cita: Date,
    hora_cita: String,
    numero_contrato: {type: Number, required: true},
    ci: Number, 
    nombre: {type: String, required: true},
    apellidos: String,
    edad: Number,
    telefono: [],       
    tipo_contrato: String,
    fotos:[{
        cantidad: Number,
        dimension: String
    }],
    accesorios:[{
        cantidad: Number,
        tipo: String
    }],
    precio: {type: Number, required: true},
    adelanto: Number,
    estado: String
});

module.exports = mongoose.model('Contrato', ContratoSchema, "contratos");