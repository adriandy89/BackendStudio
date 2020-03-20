var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var TipoContratoSchema = Schema({
    tipo: {type: String, required: true},
    precio: {type: Number, required: true},
    descripcion: String,
    fotos: [{
        cantidad: Number,
        tipoFotos: {          
            type: Schema.Types.ObjectId,
            ref: 'Foto'
        }
    }],
    accesorios: [{
        cantidad: Number,
        tipoAccesorios: {          
            type: Schema.Types.ObjectId,
            ref: 'Accesorio'
        }
    }],
    fecha_creacion: Date    
});

module.exports = mongoose.model('TipoContrato', TipoContratoSchema, "tipo_contratos");