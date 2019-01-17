const mongoose = require("mongoose");

const Cliente = mongoose.Schema({
    nombre: { type:String, trim:true },
    apellido: { type:String, trim:true },
    DNI: Number,
    direccion: { type:String, trim:true },
    nota: { type: Number, min: 0, max: 10 }
});

module.exports = mongoose.model("Cliente", Cliente);

