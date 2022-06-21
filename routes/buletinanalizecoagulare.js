const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');

Handlebars.registerHelper("afisareSageata",function(analiz) {
                                            if (analiz.rezultat>analiz.maxLimit)
                                                return "➚";
                                            if (analiz.rezultat<analiz.minLimit)
                                                return  "➘";
                                              return "&nbsp;&nbsp;&nbsp;";
                                            });
Handlebars.registerHelper("afisareRezultat", function(analiz) {
if (analiz.rezultat>analiz.maxLimit)
    return analiz.rezultat + " ➚";
if (analiz.rezultat<analiz.minLimit)
    return analiz.rezultat + " ➘";
  return analiz.rezultat;
});
Handlebars.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});
router.get('/', (req, res) => {

    footer  = Global.getFooter();
    buletin = {}; pacient = {}; coagulare = {}; inr = {};
    buletin.laborator = {};
    buletin.analize = [];
    buletin.analize2 = [];

//init
    buletin.analize.push(new Global.Analiza("APTT","36.10",24.4,36.4," s","Metoda de lucru: coagulometrie - Tipul probei: plasma"));
    buletin.analize2.push(new Global.Analiza("PT","16.9",11.0,14.0," sec",""));
    buletin.analize2.push(new Global.Analiza("AP","70.10",70,140," %",""));
    buletin.analize2.push(new Global.Analiza("INR","1.42",0.8,1.3,"",""));
    buletin.laborator.nume = "SC IMPACT LABORATORY";
    buletin.laborator.adresa = "Bd. Iancu de Hunedoara 30-32, Sector 1, Bucuresti";
    /// poate de aplicat aici la adresa ce am facut la ANAF, adresa = {oras, strada, numarStrada, regiune etc.}
    buletin.laborator.telefon =  "+40751232453";
    buletin.laborator.mail =  "office@impact-laboratory.ro";
    buletin.data= "14 Jun 2022 05:49:00";
    buletin.cod = "FL 5.8-01";
    buletin.inregistratDe = "Iuliana Titieanu";
    buletin.afisatDe ="Medic Daniela Caliga";
    buletin.dataAfisare = "14 Jun 2022 06:53:22";
    buletin.dataPrimaAfisare = "14 Jun 2022 06:53:22";
    buletin.codCerere = "BP6371";
    buletin.dataPrimireProba = "14/06/2022 06:04";
    pacient.medic = "IULIA DR. NACEA";
    pacient.nume = "BONCU MIRUNA MIHAELA";
    pacient.varsta = "17 ani 8 luni";
    pacient.sex = "F";
    pacient.cnp = "6041006295320";
    pacient.cod="421200000506476";
    pacient.sectia = "CHIRURGIE PLASTICA SI REPARATORIE";
    coagulare.stare = "CONFORMA";
    coagulare.validataDe = "MEDIC DANIELA CALIGA";
    coagulare.data = "14 JUN 2022 06:22";
    inr.metodaLucru = "Coagulometrie";
    inr.tipulProbei = "Plasma";
//end init

    etichete = {};
    res.render('buletin_analize_coagulare', { buletin,etichete, pacient, inr,coagulare, footer} );

});




module.exports = router;