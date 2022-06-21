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

router.get('/', (req, res) => {

    footer  = Global.getFooter();
    buletin = {}; pacient = {}; biochimie = {}; hemoleucograma = {};
    buletin.laborator = {};
    buletin.analize = [];
//init

    buletin.analize.push(new Global.Analiza("ALT / TGP","23.00",0,35,"U/L","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("AST / TGO","33.00",0,35,"U/L","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("CALCIU TOTAL","9.70",8.8,10.6,"mg/dL","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("CLOR","103.00",101,109,"mmol/L","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("CREATININA","0.60",0.51,0.95,"mg/dL","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("GLICEMIE","92.00",60,100,"mg/dL","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("POTASIU","3.94",3.5,5.1,"mmol/L","Potentiometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("PROTEINE TOTALE","7.30",5.7,8.0,"g/dL","Spectrofotometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("SODIU","135.00",132,142,"mmol/L","Potentiometrie - tip proba Ser"));
    buletin.analize.push(new Global.Analiza("UREE","32.00",10.8,38.4,"mg/dL","Spectrofotometrie - tip proba Ser"));
    buletin.laborator.nume = "SC IMPACT LABORATORY";
    buletin.laborator.adresa = "Bd. Iancu de Hunedoara 30-32, Sector 1, Bucuresti";
    /// poate de aplicat aici la adresa ce am facut la ANAF, adresa = {oras, strada, numarStrada, regiune etc.}
    buletin.laborator.telefon =  "+40751232453";
    buletin.laborator.mail =  "office@impact-laboratory.ro";
    buletin.data= "14 Jun 2022 05:49:00";
    buletin.cod = "FL 5.8-01";
    buletin.inregistratDe = "Iuliana Titieanu";
    buletin.afisatDe ="Medic Daniela Caliga";
    buletin.dataAfisare = "14 Jun 2022 06:36:47";
    buletin.dataPrimaAfisare = "14 Jun 2022 06:04:25";
    buletin.codCerere = "BP6371";
    buletin.dataPrimireProba = "14/06/2022 06:04";
    pacient.medic = "IULIA DR. NACEA";
    pacient.nume = "BONCU MIRUNA MIHAELA";
    pacient.varsta = "17 ani 8 luni";
    pacient.sex = "F";
    pacient.cnp = "6041006295320";
    pacient.cod="421200000506476";
    pacient.sectia = "CHIRURGIE PLASTICA SI REPARATORIE";
    biochimie.stare = "CONFORMA";
    biochimie.validataDe = "MEDIC DANIELA CALIGA";
    biochimie.data = "14 JUN 2022 06:37";
    hemoleucograma.metodaLucru = "Spectroscopie de impedanta, citometrie in flux";
    hemoleucograma.tipulProbei = "SANGE";

//end init
    etichete = {};
    res.render('buletin_analize_biochimie', { buletin,etichete, pacient, biochimie,hemoleucograma, footer} );

});




module.exports = router;