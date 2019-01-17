const mongoose = require('mongoose');
const express = require('express');

const Curso = require("./models/Curso.js").schema;

var CursosRouter = require('./routes/cursos.js');

const app = express();
const port = 3001;

var autoIncrement = require('mongoose-auto-increment');

app.use('/cursos', CursosRouter);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/capacitacion');
var db = mongoose.connection;

autoIncrement.initialize(db);
Curso.plugin(autoIncrement.plugin, {
   model: 'Curso',
   field: 'codigo',
   startAt: 4, // esto es porque hay otros 3 cursos puestos en la db
   incrementBy: 1
});


db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
   app.listen(port, () => console.log(`Corriendo en ${port}`));
});

module.exports = app;
