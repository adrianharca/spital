const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');
const url = require('url');

router.post('/',function(req,res){
   var username = req.body;
   var htmlData = 'Hello:' + JSON.stringify(username);
   res.send(htmlData);
});

router.get('/', (req, res) => {

        const query = url.parse(req.url, true).query;
        const data = query.data;
        const pacientName = query.pacient;
        etichete = {};
        foaie = {};
        foaie.evolutiiList = [];
        foaie.arsuri = [];
        foaie.anamneza = {};
        foaie.detaliipacient = {};
        foaie.buletinebio = [];
        foaie.buletinehemo = [];
        foaie.buletinecoagulare = [];
        foaie.epicrizedeetapa = [];
        foaie.fiseterapie= [];
        //init, aici sa se populeze cu detaliile legate de id-ul pacientului

        if (pacientName!=null) {
                foaie.evolutiiList.push(new Global.Evolutie(0,"18 iunie","blablabla","sa puna sare pe rana"));
                foaie.evolutiiList.push(new Global.Evolutie(1,"19 iunie","arsura in cot","Miere"));
                foaie.epicrizedeetapa.push(Global.EpicrizaDeEtapa("28/29 iunie 2022"));
                foaie.fiseterapie.push(Global.FisaTerapie("28/29 iunie 2022"));
                foaie.buletinebio.push(Global.Bio("14 Iunie"));
                foaie.buletinehemo.push(Global.Hemo("14 Iunie"));
                foaie.buletinecoagulare.push(Global.Coagulare("14 Iunie"));
                foaie.detaliipacient.medic = "IULIA DR. NACEA";
                foaie.detaliipacient.nume = "BONCU MIRUNA MIHAELA";
                foaie.detaliipacient.varsta = "17 ani 8 luni";
                foaie.detaliipacient.sex = "F";
                foaie.detaliipacient.cnp = "6041006295320";
                foaie.detaliipacient.cod = "421200000506476";
                foaie.detaliipacient.sectia = "CHIRURGIE PLASTICA SI REPARATORIE";
                foaie.epicrizafinala = "some text";
                foaie.cura = "cura";
                foaie.arsuri.push(new Global.Arsura(0, "2A", "iiii", "10"));
                foaie.arsuri.push(new Global.Arsura(1, "3", "erer", "40"));
                foaie.arsuri.push(new Global.Arsura(2, "2A", "ddddd", "20"));
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
        }
        var arsuriJsonVar = JSON.stringify(foaie.arsuri);
        var evolutiiJsonList=JSON.stringify(foaie.evolutiiList);
        res.render('foaie_observatie', {
                etichete,
                foaie,
                arsuriJsonVar,
                evolutiiJsonList
        });

});




module.exports = router;