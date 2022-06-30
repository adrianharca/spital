const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');
const url = require('url');

router.get('/', (req, res) => {
        var epicriza_etapa= {};
        const query = url.parse(req.url, true).query;
        const dataVar = query.data;
        const pacientName = query.pacient;
        //init
        if (dataVar!=null) {
            epicriza_etapa.dataVar = "28 iunie 2022";
            epicriza_etapa.simptome = "semne/simptome";
            epicriza_etapa.activitate = "activitate";
            epicriza_etapa.ekg = "ekg";
        }
        //end init
        res.render('epicriza_etapa', {epicriza_etapa});

});




module.exports = router;