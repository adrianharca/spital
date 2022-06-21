const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');

router.get('/', (req, res) => {

    etichete = {};
    foaie ={};
    foaie.recomandari = [];
    foaie.arsuri = [];
    foaie.anamneza = {};
//init
    foaie.epicrizafinala= "some text";
    foaie.cura = "cura";
    foaie.recomandari.push(new Global.Recomandare("1","sa stea locului"));
    foaie.recomandari.push(new Global.Recomandare("2","sa nu se mai joace cu focul"));
    foaie.recomandari.push(new Global.Recomandare("3","sa stea in casa"));
    foaie.recomandari.push(new Global.Recomandare("4","sa evite sa mai fumeze in benzinarie"));
    foaie.arsuri.push(new Global.Arsura(1,"3","erer","5","40"));
    foaie.arsuri.push(new Global.Arsura(2,"2A","ddddd","2","20"));
    foaie.caiResp = "";
    foaie.anamneza.loc = "bucatarie";
    foaie.anamneza.descriere = "uite asa a luat foc";
    foaie.anamneza.prezentaparinti = "";
    foaie.anamneza.locprimajutor = "baie";
    foaie.anamneza.tratamentprimajutor = "benzina";
    foaie.anamneza.transport = "caruta";
    foaie.anamneza.timp = "2 h";
    foaie.anamneza.stare = "n-avea stare";
    foaie.anamneza.tratasport = "nu i-am mai turnat benzina ca e scumpa";
//end init

    var arsuriJsonVar = JSON.stringify(foaie.arsuri);
    var recomandariJsonVar = JSON.stringify(foaie.recomandari);
    res.render('foaie_observatie', { etichete, foaie, arsuriJsonVar,recomandariJsonVar } );

});




module.exports = router;