const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const Curso = require("./models/Curso.js");

var CursosRouter = require('./routes/cursos.js');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.put("/cursos/:id", function (req, res) {
    Curso.findOneAndUpdate({_id: req.params.id}, {$set:{alumnos: req.body}},
        function (error, success) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(success);
            }
    });
});

app.use('/cursos', CursosRouter);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/capacitacion');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    app.listen(port, () => console.log(`Corriendo en ${port}`));
});

module.exports = app;
