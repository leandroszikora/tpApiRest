const mongoose = require("mongoose");
const Cliente = require("./Cliente.js").schema;

const Curso = mongoose.Schema({
    anioDictado: Number,
    duracion: { type: String, trim: true },
    tema: { type: String, trim: true },
    alumnos: { type: [Cliente], default: []}
});

Curso.statics.findById = function (id) {
    return this.findOne({_id: id});
};
module.exports = mongoose.model("Curso", Curso);
