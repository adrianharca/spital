const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');
const url = require('url');
var mysql = require('mysql');
const session = require('express-session');
Handlebars.registerHelper('checked', function(value, test) {
    if (value == undefined) return '';
    return value==test ? 'checked' : '';
});
function checkChanges(req, con, body, oldrecord, idfoaie){

    var actionString = "salvare epicriză: <br>";

    actionString = actionString + Global.appendToAuditTrailString(oldrecord, body,"staregenerala","stare" );
    actionString = actionString + Global.appendToAuditTrailCheckbox(oldrecord, body,"intubat","intubat" );
    actionString = actionString + Global.appendToAuditTrailCheckbox(oldrecord, body,"tranzitreluat","tranzitreluat" );
    actionString = actionString + Global.appendToAuditTrailString(oldrecord, body,"cantitatediureza","diureza" );
    actionString = actionString + Global.appendToAuditTrailCheckbox(oldrecord, body,"extremitati","extremitati" );
    actionString = actionString + Global.appendToAuditTrailCheckbox(oldrecord, body,"mucoase","mucoase" );
    Global.insertIntoAudit(con, idfoaie, actionString, req.session.userid, new Date(),'foaie');
}
router.post('/', (req, res) => {
    if (req.session==undefined  || req.session.userid==undefined) {
        res.redirect('/users/login');
        return;
    };
    let errors = [];
    const query = url.parse(req.url, true).query;
    var idfoaie = query.idfoaie;
    var idepicriza = query.idepicriza;
    let { stare, dataEpicriza, intubat, tranzitreluat, diureza, extremitati, mucoase} = req.body;
    epicriza_etapa = {};
    epicriza_etapa.dataVar = dataEpicriza;
    epicriza_etapa.staregenerala = stare;
    epicriza_etapa.intubat = intubat;
    epicriza_etapa.tranzitreluat = tranzitreluat;
    epicriza_etapa.cantitatediureza = diureza;
    epicriza_etapa.extremitati = extremitati;
    epicriza_etapa.mucoase = mucoase;
    epicriza_etapa.idfoaie = idfoaie;
     if (dataEpicriza=='') {
            errors.push ({"text": "Data epicrizei nu este completata"});
        };
     if (stare =='') {
                 errors.push ({"text": "Starea pacientului nu a fost completata"});
             };
     if (errors.length > 0) {
         res.render('epicriza_etapa', {
           errors,
           epicriza_etapa
         });
         }
     else {
         var con = mysql.createConnection({host: Global.getHost(),user: Global.getUser(),
                                password: Global.getParola(),port: 3306});
                          con.connect(function(err) {
                            if (err) throw err;

                          });
         if (idepicriza==null)
            idepicriza = -1;
         var select = "SELECT * FROM spital.epicrize_etapa where idepicrize_etapa = " + idepicriza;
         con.query(select, (error, results, fields) => {
                               if (error) {
                                           return console.error(error.message);
                               }
                               sizeOfSelect = results.length;
                               var con = mysql.createConnection({
                                                     host: Global.getHost(),
                                                     user: Global.getUser(),
                                                     password: Global.getParola()
                               });
                               con.connect(function(err) {
                                                   if (err) throw err;

                               });
                               var changeQuery;
                               if (sizeOfSelect==0) {
                                        changeQuery = " insert into spital.epicrize_etapa(idfoaie, dataVar, staregenerala, intubat, tranzitreluat, cantitatediureza, extremitati, mucoase) values("
                                        + idfoaie + ",'"+ dataEpicriza+"','"+ stare +"','"+ Global.convertDa(intubat)+ "','"+ Global.convertDa(tranzitreluat) +"','"+ diureza +"','"+ Global.convertDa(extremitati) +"','"+ Global.convertDa(mucoase) +"')";
                                        Global.insertIntoAudit(con, idfoaie, 'creare epicriza etapa ' + dataEpicriza, req.session.userid, new Date(),'foaie');
                               }
                               else {
                                         var oldRecord = results[0];
                                         changeQuery = " update spital.epicrize_etapa set dataVar='"+ dataEpicriza +"', staregenerala='"+ stare+"', " +
                                         " intubat = '" + Global.convertDa(intubat) + "', tranzitreluat='" + Global.convertDa(tranzitreluat) + "', cantitatediureza='" + diureza + "', "
                                         + " extremitati='" + Global.convertDa(extremitati) + "', mucoase='" + Global.convertDa(mucoase) + "' where idepicrize_etapa = " + idepicriza;
                                         checkChanges(req, con, req.body, oldRecord, idfoaie);
                               }
                               con.query(changeQuery, function (err, result) {
                                                 if (err) throw err;
                                                 con.end();
                                     });
                               });
        res.redirect('/pacients');
     }
});

router.get('/', (req, res) => {
    if (req.session==undefined || req.session.userid==undefined) {
        res.redirect('/users/login');
        return;
    };
        var epicriza_etapa= {};
        const query = url.parse(req.url, true).query;
        var idfoaie = query.idfoaie;
        var idepicriza = query.idepicriza;
        epicriza_etapa = {};
        var con = mysql.createConnection({host: Global.getHost(),user: Global.getUser(),
                                        password: Global.getParola(),port: 3306});
                                  con.connect(function(err) {
                                    if (err) throw err;

                                  });
        epicriza_etapa.idfoaie = idfoaie;
        //init
        if (idfoaie!=null) {
            if (idepicriza!=null) {
                    var select = "SELECT * FROM spital.epicrize_etapa where idepicrize_etapa=" + idepicriza;
                    con.query(select, (error, results, fields) => {
                          if (error) {
                                return console.error(error.message);
                          }
                           if (results[0]!=undefined) {
                                epicriza_etapa.idfoaie = results[0].idfoaie;
                                epicriza_etapa.idepicrize_etapa = results[0].idepicrize_etapa;

                                epicriza_etapa.staregenerala = results[0].staregenerala;
                                epicriza_etapa.intubat = Global.convertToDa(results[0].intubat);
                                epicriza_etapa.tranzitreluat = Global.convertToDa(results[0].tranzitreluat);
                                epicriza_etapa.cantitatediureza = results[0].cantitatediureza;
                                epicriza_etapa.extremitati = Global.convertToDa(results[0].extremitati);
                                epicriza_etapa.mucoase = Global.convertToDa(results[0].mucoase);
                                epicriza_etapa.dataVar = results[0].dataVar;
                                res.render('epicriza_etapa', {epicriza_etapa});
                           }
                           else {
                                res.send("Nu am gasit epicriza de etapa cu acest identificator:" + idepicriza);
                           }
                    });

            }
            else {
                res.render('epicriza_etapa', {epicriza_etapa});
            }
        }
        else {
            res.send("Epicriza de etapa nu a putut fi genereata, pentru ca id-ul foii de observatie nu a fost completat in query string (adica adresa arata asa: https://site/epicriza_etapa , fara '?idfoaie=numar'). Duceti-va in aplicatie pe o foaie de observatie si alegeti o epicriza sau generati una noua din buton");
        }
        //end init


});




module.exports = router;
