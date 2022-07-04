const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');
const url = require('url');

Handlebars.registerHelper('checked', function(value, test) {
    if (value == undefined) return '';
    return value==test ? 'checked' : '';
});

router.get('/', (req, res) => {
        var epicriza_etapa= {};
        const query = url.parse(req.url, true).query;
        const dataVar = query.data;
        const pacientName = query.pacient;
        //init
        if (dataVar!=null) {
            epicriza_etapa.dataVar = "28 iunie 2022";
            epicriza_etapa.staregenerala = "ok";
            epicriza_etapa.intubat = "Da";
            epicriza_etapa.tranzitreluat = "Da";
            epicriza_etapa.cantitatediureza = "diureza";
            epicriza_etapa.extremitati = "Nu";
            epicriza_etapa.mucoase = "Da";
        }
        //end init
        res.render('epicriza_etapa', {epicriza_etapa});

});




module.exports = router;