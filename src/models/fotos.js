var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var FotoSchema = Schema({
    dimension: {type: String, required: true},
    precio: {type: Number, required: true},
    descripcion: String,
    fecha_creacion: Date,
    tipoContrato:[{          
        type: Schema.Types.ObjectId,
        ref: 'TipoContrato'
    }]
});

module.exports = mongoose.model('Foto', FotoSchema, "fotos");