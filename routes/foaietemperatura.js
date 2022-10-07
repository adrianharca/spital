const express = require('express');

var Global = require("../functions.js");
const router = express.Router();
const url = require('url');

var mysql = require('mysql');
global.chart = require('chart');
var emptyStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
var ziuadeboalaLabel = "Ziua de boală";
var lichLabel = "Lichide ingerate";
var diurezaLabel = "Diureza";
var scauneLabel = "Scaune";
var dietaLabel = "Dieta";
var tempLongLabel = "Temperatura";
var tempLabel = "Temp.";
var pulsLabel = "Puls";
var respLabel = "Resp.";
var respLongLabel = "Respirația";
var taLabel = "T.A.";
var FTchart = function (ziuaVar, ziledeboalaVar, timpul_zileiVar) {
    this.ziua = ziuaVar;
    this.ziledeboala = ziledeboalaVar;
    this.timpul_zilei = timpul_zileiVar;
    return this;
};
var FTchart = function (ziuaVar, ziledeboalaVar, timpul_zileiVar, respVar, taVar, pulsVar, tempVar) {
    this.ziua = ziuaVar;
    this.ziledeboala = ziledeboalaVar;
    this.timpul_zilei = timpul_zileiVar;
    this.resp = respVar;
    this.ta = taVar;
    this.puls = pulsVar;
    this.temp = tempVar;
    return this;
};
var FTchart = function (ziuaVar, ziledeboalaVar, timpul_zileiVar, respVar, taVar, pulsVar, tempVar,lichide_ingerateVar,diurezaVar, scauneVar, dietaVar) {
    this.ziua = ziuaVar;
    this.ziledeboala = ziledeboalaVar;
    this.timpul_zilei = timpul_zileiVar;
    this.resp = respVar;
    this.ta = taVar;
    this.puls = pulsVar;
    this.temp = tempVar;
    this.lichide_ingerate = lichide_ingerateVar;
    this.scaune = scauneVar;
    this.diureza = diurezaVar;
    this.dieta = dietaVar;
    return this;
};
var   labels   = [],
            labels2 = [],
            labelsDays = [],
             temp    = [],
                    resp       = [],
                    ta      = [],
                    puls     = [],
                    lichide = [],
                    diureza = [],
                    scaune = [],
                    dieta = [];
router.post('/', (req, res) => {

});

function constructFoaie(results, res){
var arr = [];
    ////// initialize sample data
    var startDay = 7;

    var day=startDay;
    var illnessDay = 57;

    arr.push(new FTchart(day,illnessDay,"D",24,25,120,37.9));
    arr.push(new FTchart(day++,illnessDay++,"S",26,24,124,38.1,300,1500,1,"V"));
    arr.push(new FTchart(day,illnessDay,"D",25,26,120,36.9));
    arr.push(new FTchart(day++,illnessDay++,"S",27,25,130,36.5,600,1800,2,"V"));
    arr.push(new FTchart(day,illnessDay,"D",28,23,140,36.1));
    arr.push(new FTchart(day++,illnessDay++,"S",27,21,135,38.5,500,1200,1,"V"));

    arr.push(new FTchart(day,illnessDay,"D",28,21,145,36));
    arr.push(new FTchart(day++,illnessDay++,"S",27,22,140,38.6,375,1300,1,"V"));
    arr.push(new FTchart(day,illnessDay,"D",29,23,145,39.4));
    arr.push(new FTchart(day++,illnessDay++,"S",28,24,140,36.8,125,1200,1,"V"));
    arr.push(new FTchart(day,illnessDay,"D",29,21,150,36.2));
    arr.push(new FTchart(day++,illnessDay++,"S",28,22,155,36.6,125,1200,1,"V"));
// "SELECT prenume, numefamilie, f.greutateactuala, f.inaltime, zi, luna, an, sex, cnp, cod, greutatenastere, f.medic as medic, f.sectia as sectia, f.arsuri as arsuri, f.greutateactuala as greutateactuala, f.sange, f.rh, f.diagnosticprincipal  FROM spital.pacient p left join spital.foaie_observatie f on f.idpacient = p.idpacient where p.idpacient=(select idpacient from spital.foaie_observatie where idfoaie_observatie=" + idfoaie + ")";

    cnp = results[0].cnp;
    prenumeStr = results[0].prenume;
    numeStr = results[0].numefamilie;
    nr = idfoaie;
    an = results[0].an;
    luna = results[0].luna;

    greutateactuala = results[0].greutateactuala;
    greutatenastere = results[0].greutatenastere;
    indiceponderal = results[0].indiceponderal;
    salon = results[0].salon;
    pat = results[0].pat;
    /// ??? ce facem cu campul acesta ???

    suprafatacorporala = emptyStr;
    //// end ce facem ???
    var nonVoidEntries = arr.length;
    // do we need to add also the rest of the days in that particular month????? if so, let's uncomment
/*
    for (var i=0;i<29-nonVoidEntries+1;i++){
        arr.push(new FTchart(day,illnessDay,"D"));
        arr.push(new FTchart(day++,illnessDay++,"S"));
    }
*/
    // end do we need to add also the rest of the days?

    prenume = prenumeStr;


    nume = numeStr;

    lichide = []; diureza = []; scaune = []; dieta = [];labels = [];labels2 = [];
    labelsDays = []; temp = []; resp = []; ta = []; puls = [];
    arr.forEach((entry) => {
        labels.push( entry.ziua + " " + entry.timpul_zilei);
        labels2.push( entry.ziledeboala);
        labelsDays.push( entry.ziua);
        temp.push(entry.temp);
        resp.push(entry.resp);
        ta.push(entry.ta);
        puls.push(entry.puls);
        if (entry.lichide_ingerate!==undefined)
            lichide.push (entry.lichide_ingerate);
        if (entry.diureza!==undefined)
            diureza.push (entry.diureza);
        if (entry.scaune!==undefined)
            scaune.push (entry.scaune);
        if (entry.dieta!==undefined)
            dieta.push (entry.dieta);
    });
    uniqDays = [...new Set(labelsDays)];
    foaieTemperatura = {arr, labels, temp, resp, ta, puls, labels2,uniqDays,lichide,diureza,scaune,dieta};
    pacient = {cnp, prenume, nume,greutateactuala,greutatenastere,indiceponderal,suprafatacorporala};
    detaliiFoaie = {an, luna, nr, salon, pat};

    etichete = {ziuadeboalaLabel, lichLabel,diurezaLabel,scauneLabel,dietaLabel,tempLongLabel,tempLabel,pulsLabel,respLabel,respLongLabel,taLabel};
    res.render('chart', { foaieTemperatura, pacient, detaliiFoaie, etichete} );

}

router.get('/', (req, res) => {
    const query = url.parse(req.url, true).query;

    idfoaie = query.foaie;
    var sql = "SELECT prenume, numefamilie, f.greutateactuala, f.indiceponderal, f.zi as zi, f.luna as luna, f.an as an, sex, cnp, cod, greutatenastere, f.medic as medic, f.sectia as sectia, f.salon as salon, f.pat as pat, f.arsuri as arsuri, f.greutateactuala as greutateactuala, f.sange, f.rh, f.diagnosticprincipal  FROM spital.pacient p left join spital.foaie_observatie f on f.idpacient = p.idpacient where p.idpacient=(select idpacient from spital.foaie_observatie where idfoaie_observatie=" + idfoaie + ")";
    var con = mysql.createConnection({host: Global.getHost(),user: Global.getUser(),password: Global.getParola(),port: 3306});
    con.connect(function(err) {
        if (err) throw err;

    });
    con.query(sql, (error, results, fields) => {
          if (error) {
                 return console.error(error.message);
          }
          constructFoaie(results, res);
    });



});




module.exports = router;