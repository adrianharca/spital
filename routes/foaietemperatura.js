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
var foaieTemperatura;
var tempLongLabel = "Temperatura";
var tempLabel = "Temp.";
var pulsLabel = "Puls";
var respLabel = "Resp.";
var respLongLabel = "Respirația";
var taLabel = "T.A.";

var startDay;
var illnessDay;

function returnSqlForTemp (idFoaie){
    return "SELECT p.idpacient as idpacient, chart, prenume, numefamilie, f.greutateactuala, " +
                                                     " f.indiceponderal, f.zi as zi, f.luna as luna, f.an as an, sex, cnp, cod, greutatenastere, f.medic as medic, f.sectia as sectia, "+
                                                     " f.salon as salon, f.pat as pat, f.arsuri as arsuri, f.greutateactuala as greutateactuala, f.sange, f.rh, f.diagnosticprincipal " +
                                                     " FROM spital.pacient p left join (select * from spital.foaie_temperatura t right join " +
                                                     " spital.foaie_observatie f on f.idfoaie_observatie = t.idfoaie " +
                                                     " where f.idfoaie_observatie=" + idFoaie+ ") f on f.idpacient = p.idpacient " +
                                                     " where f.idfoaie_observatie=" + idFoaie;
}

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
     const query = url.parse(req.url, true).query;
     //foaieTemperatura, pacient, detaliiFoaie
     idfoaie = query.foaie;
     selectsql = "select * from spital.foaie_temperatura where idfoaie=" + idfoaie;

     var con = mysql.createConnection({host: Global.getHost(),user: Global.getUser(),password: Global.getParola(),port: 3306});
              con.connect(function(err) {
                  if (err) throw err;

     });
      con.query(selectsql, (error, results, fields) => {
                 if (error) {
                      return console.error(error.message);
                 }
                 var foaieTemperaturaSaved = {};
                 foaieTemperaturaSaved.respVar = req.body.respVar;
                 foaieTemperaturaSaved.taVar = req.body.taVar;
                 foaieTemperaturaSaved.pulsVar = req.body.pulsVar;
                 foaieTemperaturaSaved.tempVar = req.body.tempVar;
                 foaieTemperaturaSaved.labelsVarArr = req.body.labelsVarArr;
                 foaieTemperaturaSaved.labels2VarArr = req.body.labels2VarArr;
                 foaieTemperaturaSaved.lichideL = req.body.lichideL;
                 foaieTemperaturaSaved.uniqDaysL = req.body.UniqDaysL;
                 foaieTemperaturaSaved.diurezaL = req.body.diurezaL;
                 foaieTemperaturaSaved.scauneL = req.body.scauneL;
                 foaieTemperaturaSaved.dietaL = req.body.dietaL;

                 sizeOfSelect = results.length;
                 if (req.body.labelsVarArr!=undefined)
                        startDay = req.body.labelsVarArr[0].split(" ")[0];
                    else
                        startDay = 1;
                    var day=startDay;
                    if (req.body.labels2VarArr[0]!=undefined)
                        illnessDay = req.body.labels2VarArr[0];
                    else
                        illnessDay = 1;
                 var updateInsertSql;
                 if (sizeOfSelect==0)  {
                    updateInsertSql = "insert into spital.foaie_temperatura(idfoaie,chart, startday, illnessday) values ("+ idfoaie + ",'" + JSON.stringify(foaieTemperaturaSaved) + "','" + startDay+ "','"+ illnessDay+"')";
                 }
                 else {
                    updateInsertSql =  "update spital.foaie_temperatura set chart='" + JSON.stringify(foaieTemperaturaSaved) + "', startday='" + startDay+ "', illnessday='"+ illnessDay+"' where idfoaie="+idfoaie;
                 }

                var sql = returnSqlForTemp(idfoaie);
                con.query(updateInsertSql, (errorU, resultsU, fieldsU) => {
                   if (errorU) {
                        return console.error(errorU.message);
                   }
                   con.query(sql, (error2, results2, fields2) => {
                                      if (error2) {
                                           return console.error(error.message);
                                      }
                                      constructFoaie(results2, res);
                                   });
                });

     });

});
function constructFoaie(results, res){
var arr = [];
    ////// initialize sample data

/*
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
*/

    lichide = []; diureza = []; scaune = []; dieta = []; labels = []; labels2 = [];
    labelsDays = []; temp = []; resp = []; ta = []; puls = [];
    var chart;
    if (results[0].chart!=undefined){
        chart = JSON.parse(results[0].chart);
        labels = chart.labelsVarArr;
            labels2 = chart.labels2VarArr;
            if (labels[0]!=undefined)
                startDay = labels[0].split(" ")[0];
            else
                startDay = 1;
            var day=startDay;
            if (labels2[0]!=undefined)
                illnessDay = labels2[0];
            else
                illnessDay = 1;
    }
    else
    {
        chart = {};
        labels = [];
        labels2 = [];
        startDay = 1;
        illnessDay = 1;
    }

    puls = chart.pulsVar;
    ta = chart.taVar;
    resp = chart.respVar;
    temp = chart.tempVar;
    lichide = chart.lichideL;
    diureza = chart.diurezaL;
    uniqDays = chart.uniqDaysL;
    dieta = chart.dietaL;
    scaune = chart.scauneL;

    cnp = results[0].cnp;
    prenumeStr = results[0].prenume;
    numeStr = results[0].numefamilie;
    nr = idfoaie;
    an = results[0].an;
    luna = results[0].luna;
    idpacient = results[0].idpacient;
    greutateactuala = results[0].greutateactuala;
    greutatenastere = results[0].greutatenastere;
    indiceponderal = results[0].indiceponderal;
    salon = results[0].salon;
    pat = results[0].pat;

    if (results[0].chart!=undefined)
        chart = JSON.parse(results[0].chart);
    else
        chart = {};
    /// ??? ce facem cu campul acesta ???

    suprafatacorporala = emptyStr;
    //// end ce facem ???
    var nonVoidEntries = arr.length;


    prenume = prenumeStr;


    nume = numeStr;


    uniqDays = [...new Set(labelsDays)];
    foaieTemperatura = {arr, labels, temp, resp, ta, puls, labels2,uniqDays,lichide,diureza,scaune,dieta};
    pacient = {idpacient,cnp, prenume, nume,greutateactuala,greutatenastere,indiceponderal,suprafatacorporala};
    detaliiFoaie = {an, luna, nr, salon, pat};

    etichete = {ziuadeboalaLabel, lichLabel,diurezaLabel,scauneLabel,dietaLabel,tempLongLabel,tempLabel,pulsLabel,respLabel,respLongLabel,taLabel};
    res.render('chart', { foaieTemperatura, pacient, detaliiFoaie, etichete} );

}

router.get('/', (req, res) => {
   const query = url.parse(req.url, true).query;

    idfoaie = query.foaie;
    var sql = returnSqlForTemp(idfoaie);
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