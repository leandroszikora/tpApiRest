var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { checkSchema, validationResult } = require('express-validator/check');

const Curso = require("../models/Curso");
var path = require('path');

router.use(bodyParser.urlencoded({ extended: true}));

router.get('/', function(req, res){
    let criterio = {};
    if(req.query.anioDictado != null) {
        criterio.anioDictado = Number(req.query.anioDictado);
    }
    if(req.query.duracion != null) {
        criterio.duracion = req.query.duracion;
    }

    Curso.find(criterio).limit(10).then(function(curso) {
        res.json(curso);
    }).catch((err) => {
        console.error(err);
        res.status(500);
        res.send();
    })
});

function findOneCurso(req,res, onSuccess)
{
    Curso.findById(req.params.id).then(function (curso) {

        if(curso == null)
        {
            res.status(404).send();
            return;
        }

        res.json(onSuccess(curso));

    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
}

router.get('/:id', function (req, res) {
    findOneCurso(req, res, (curso) => curso);
});

router.get('/:id/alumnos', function (req, res) {
    findOneCurso(req, res, (curso) => curso.alumnos);
});

router.post('/', checkSchema({
    anioCurso: {
        in: ['body'],
        errorMessage: 'El campo anioCurso debe ser un numero valido',
        isInt: true
    },
    duracionCurso: {
        in: ['body'],
        errorMessage: 'El campo duracionCurso debe ser de tipo String',
        isString: true
    },
    temaCurso: {
        in: ['body'],
        errorMessage: 'El campo temaCurso debe ser de tipo String',
        isString:true
    }

}), function (req, res) {

    let validation = validationResult(req).array();

    if (validation.length > 0) {
        res.status(400).json(validation);
        return;
    }

    var nuevoCurso = new Curso({
        anioDictado: req.body.anioCurso,
        duracion: req.body.duracionCurso,
        tema: req.body.temaCurso
    });

    nuevoCurso.save().then(doc => {

        res.status(201).json(doc);

    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });

});

router.delete('/:id', function (req, res) {
   findOneCurso(req, res, (curso) => { curso.remove(); return curso;});
});

router.get('/:id/mejorAlumno', function(req, res) {

    function mejorNota(doc1, doc2) {
        return doc1.nota > doc2.nota;
    }

    findOneCurso(req, res, (curso) => {
       return curso.alumnos.sort(function mejorNota(doc1, doc2) {
           return doc1.nota < doc2.nota;
       })[0];
    });
});

module.exports = router;