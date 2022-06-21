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
    buletin = {}; pacient = {}; hematologie = {}; hemoleucograma = {};
    buletin.laborator = {};
    buletin.analize = [];
//init

    buletin.analize.push(new Global.Analiza("WBC","11.76",4,10,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("NEU#","8.07",2,7,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("LYM#","2.16",0.80,4,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("MON#","1.11",0.12,1.20,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("EOS#","0.41",0.02,0.5,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("BAS#","0.01",0,0.10,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("NEU%","68.60",50,70,"%",""));
    buletin.analize.push(new Global.Analiza("LYM%","18.40",20,40,"%",""));
    buletin.analize.push(new Global.Analiza("MON%","9.40",3,12,"%",""));
    buletin.analize.push(new Global.Analiza("EOS%","3.50",0.5,5,"%",""));
    buletin.analize.push(new Global.Analiza("BAS%","0.10",0,1,"%",""));
    buletin.analize.push(new Global.Analiza("RBC","3.75",3.50,5.00,"10^12/L",""));
    buletin.analize.push(new Global.Analiza("HGB","10.50",11,15,"g/dL",""));
    buletin.analize.push(new Global.Analiza("HCT","31.30",37,47,"%",""));
    buletin.analize.push(new Global.Analiza("MCV","83.50",80,100,"fL",""));
    buletin.analize.push(new Global.Analiza("MCH","27.90",27,34,"pg",""));
    buletin.analize.push(new Global.Analiza("MCHC","33.40",32,36,"g/dL",""));
    buletin.analize.push(new Global.Analiza("RDW-CV","13.80",11,16,"%",""));
    buletin.analize.push(new Global.Analiza("RDW-SD","42.90",35,56,"fL",""));
    buletin.analize.push(new Global.Analiza("PLT","355.0",150,400,"10^9/L",""));
    buletin.analize.push(new Global.Analiza("MPV","9.90",6.5,12,"fL",""));
    buletin.analize.push(new Global.Analiza("PDW","16.20",15,17,"",""));
    buletin.laborator.nume = "SC IMPACT LABORATORY";
    buletin.laborator.adresa = "Bd. Iancu de Hunedoara 30-32, Sector 1, Bucuresti";
    /// poate de aplicat aici la adresa ce am facut la ANAF, adresa = {oras, strada, numarStrada, regiune etc.}
    buletin.laborator.telefon =  "+40751232453";
    buletin.laborator.mail =  "office@impact-laboratory.ro";
    buletin.data= "14 Jun 2022 05:49:00";
    buletin.cod = "FL 5.8-01";
    buletin.inregistratDe = "Iuliana Titieanu";
    buletin.afisatDe ="Medic Daniela Caliga";
    buletin.dataAfisare = "14 Jun 2022 06:22:09";
    buletin.dataPrimaAfisare = "14 Jun 2022 06:22:09";
    buletin.codCerere = "BP6371";
    buletin.dataPrimireProba = "14/06/2022 06:04";
    pacient.medic = "IULIA DR. NACEA";
    pacient.nume = "BONCU MIRUNA MIHAELA";
    pacient.varsta = "17 ani 8 luni";
    pacient.sex = "F";
    pacient.cnp = "6041006295320";
    pacient.cod="421200000506476";
    pacient.sectia = "CHIRURGIE PLASTICA SI REPARATORIE";
    hematologie.stare = "CONFORMA";
    hematologie.validataDe = "MEDIC DANIELA CALIGA";
    hematologie.data = "14 JUN 2022 06:22";
    hemoleucograma.metodaLucru = "Spectroscopie de impedanta, citometrie in flux";
    hemoleucograma.tipulProbei = "SANGE";

//end init
    etichete = {};
    res.render('buletin_analize_hemato', { buletin,etichete, pacient, hematologie,hemoleucograma, footer} );

});




module.exports = router;