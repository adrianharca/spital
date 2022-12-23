const express = require('express');
const router = express.Router();
const url = require('url');
const session = require('express-session');
var mysql = require('mysql');

var Global = require("../functions.js");
var emptyStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

var arsuri;
var Comment = function (oraV, solPerfuzabilV, tratamentV, diurezaV, scaunV, varsatV, lichideIngerateV) {
    this.ora = oraV,
    this.solPerfuzabil = solPerfuzabilV,
    this.tratament = tratamentV,
    this.diureza = diurezaV,
    this.scaun = scaunV,
    this.varsat =  varsatV,
    this.lichideIngerate = lichideIngerateV
}

function builtActionString(results,fields, idfisa){
 var found = false;
 actionString = "";

 for(property in results){
     if (fields[property]!=undefined && fields[property].toString().trim().localeCompare(results[property].toString().trim())!=0){
         found = true;
         actionString = actionString + property + " (" + results[property].toString().trim() + " -> " + fields[property].toString().trim() + ")<br>";
     }
  }

  comments = JSON.parse(results.comments);


  for(let i=0;i<comments.length;i++){
    if (comments[i].solPerfuzabil!=fields["commsol"+i]) { found = true;
        actionString = actionString + "sol perfuzabila com. " + i + " (" + comments[i].solPerfuzabil + " -> " + fields["commsol"+i] + ")<br>";
        }
    if (comments[i].tratament!=fields["commtrat"+i]) { found = true;
        actionString = actionString + "tratament com. " + i + " (" + comments[i].tratament + " -> " + fields["commtrat"+i] + ")<br>";
        }
    if (comments[i].diureza!=fields["commdiureza"+i]) { found = true;
        actionString = actionString + "diureza com. " + i + " (" + comments[i].diureza + " -> " + fields["commdiureza"+i] + ")<br>";
        }
    if (comments[i].scaun!=fields["commscaun"+i]) { found = true;
        actionString = actionString + "scaun com. " + i + " (" + comments[i].scaun + " -> " + fields["commscaun"+i] + ")<br>";
        }
    if (comments[i].varsat!=fields["commvarsat"+i]) { found = true;
        actionString = actionString + "varsat com. " + i + " (" + comments[i].varsat + " -> " + fields["commvarsat"+i] + ")<br>";
        }
    if (comments[i].lichideIngerate!=fields["commlichide"+i]) { found = true;
        actionString = actionString + "lichide ing. com. " + i + " (" + comments[i].lichideIngerate + " -> " + fields["commlichide"+i] + ")<br>";
        }
  }
 if (found)
    actionString = "salvare fisa terapie " + idfisa + " ("+ fields["dataForm"] + ")<br> " + actionString;

 return actionString;
 }
router.post('/', (req, res) => {
    const query = url.parse(req.url, true).query;
    var pacientName = query.pacient;
    var idfoaie = query.idfoaie;
    var idfisa = query.idfisa;

    let {dataForm, row1col1,row1col2,row1col3,
    row2col1,row2col2,row2col3,
    row3col1,row3col2,row3col3,
    row4col1,row4col2,row4col3,
    row5col1,row5col2,row5col3,
    row6col1,row6col2,row6col3,
    row7col1,row7col2,row7col3, comments} = req.body;
    errors = [];
    detaliiFisa = {row1col1,row1col2,row1col3,
                    row2col1,row2col2,row2col3,
                    row3col1,row3col2,row3col3,
                    row4col1,row4col2,row4col3,
                    row5col1,row5col2,row5col3,
                    row6col1,row6col2,row6col3,
                    row7col1,row7col2,row7col3 };
    comments = [];
    for(var i=0;i<24;i++){
          var oraV =  i;
          comments.push(new Comment(oraV,req.body["commsol"+oraV],req.body["commtrat"+oraV],req.body["commdiureza"+oraV],req.body["commscaun"+oraV],req.body["commvarsat"+oraV],req.body["commlichide"+oraV]));
    }
    if (dataForm=='') {
         errors.push ({"text": "Data nu este completată."});
         res.render('fisaterapie', {errors,fisa, pacient,detaliiFisa, comments, arsuri} );
         return;
    };


    if (idfisa==undefined)
          idfisa = -1;

    var select = "select * from spital.fisa_terapie_intensiva where idfisa_terapie_intensiva=" + idfisa;
                      var con = mysql.createConnection({ host: Global.getHost(), user: Global.getUser(),password: Global.getParola()});
                      con.connect(function(err) {
                                if (err) throw err;
                      });
                      con.query(select, (error, results, fields) => {
                             if (error) {
                                    return console.error(error.message);
                             }
                             sizeOfSelect = results.length;
                             comments = [];
                             for(var i=0;i<24;i++){
                                   var oraV =  i;
                                   comments.push(new Comment(oraV,req.body["commsol"+oraV],req.body["commtrat"+oraV],req.body["commdiureza"+oraV],req.body["commscaun"+oraV],req.body["commvarsat"+oraV],req.body["commlichide"+oraV]));
                                   }
                             var changeQuery;
                             if (sizeOfSelect==0) {
                                changeQuery = "INSERT INTO spital.fisa_terapie_intensiva"+
                                               "(id_foaie,data,"+
                                               "row1col1,row1col2,row1col3,"+
                                               "row2col1,row2col2,row2col3,"+
                                               "row3col1,row3col2,row3col3,"+
                                               "row4col1,row4col2,row4col3,"+
                                               "row5col1,row5col2,row5col3,"+
                                               "row6col1,row6col2,row6col3,"+
                                               "row7col1,row7col2, row7col3, comments)"+
                                               "VALUES("+idfoaie+",'"+ dataForm + "'," +
                                               "'"+ row1col1 +"','"+ row1col2 +"','"+ row1col3 +"',"+
                                               "'"+ row2col1 +"','"+ row2col2 +"','"+ row2col3 +"',"+
                                               "'"+ row3col1 +"','"+ row3col2 +"','"+ row3col3 +"',"+
                                               "'"+ row4col1 +"','"+ row4col2 +"','"+ row4col3 +"',"+
                                               "'"+ row5col1 +"','"+ row5col2 +"','"+ row5col3 +"',"+
                                               "'"+ row6col1 +"','"+ row6col2 +"','"+ row6col3 +"',"+
                                               "'"+ row7col1 +"','"+ row7col2 +"','"+ row7col3 +"','"+JSON.stringify(comments) + "');";
                             }
                             else {
                                changeQuery = "UPDATE spital.fisa_terapie_intensiva SET data = '"+ dataForm + "'," +
                                               "row1col1 = '"+ row1col1 +"',row1col2 = '"+ row1col2 +"',row1col3 = '"+ row1col3 +"',"+
                                               "row2col1 = '"+ row2col1 +"',row2col2 = '"+ row2col2 +"',row2col3 = '"+ row2col3 +"',"+
                                               "row3col1 = '"+ row3col1 +"',row3col2 = '"+ row3col2 +"',row3col3 = '"+ row3col3 +"',"+
                                               "row4col1 = '"+ row4col1 +"',row4col2 = '"+ row4col2 +"',row4col3 = '"+ row4col3 +"',"+
                                               "row5col1 = '"+ row5col1 +"',row5col2 = '"+ row5col2 +"',row5col3 = '"+ row5col3 +"',"+
                                               "row6col1 = '"+ row6col1 +"',row6col2 = '"+ row6col2 +"',row6col3 = '"+ row6col3 +"',"+
                                               "row7col1 = '"+ row7col1 +"',row7col2 = '"+ row7col2 +"',row7col3 = '"+ row7col3 +"',"+
                                               "comments= '"+JSON.stringify(comments) +"' " +
                                               "WHERE idfisa_terapie_intensiva = " + idfisa;
                             }
                             con.query(changeQuery, function (err, result) {
                                     if (err) throw err;
                                    detaliiFisa = {row1col1,row1col2,row1col3,
                                                  row2col1,row2col2,row2col3,
                                                  row3col1,row3col2,row3col3,
                                                  row4col1,row4col2,row4col3,
                                                  row5col1,row5col2,row5col3,
                                                  row6col1,row6col2,row6col3,
                                                  row7col1,row7col2,row7col3 };


                                     var action;
                                     if (result.insertId) {
                                            action = "creare fisa terapie " + result.insertId + " (" + req.body["dataForm"] +  ")";
                                            id = result.insertId
                                        }
                                     else {
                                        action = builtActionString(results[0], req.body, idfisa);
                                        id = idfisa;
                                     }
                                     if (action!="")
                                     con.query("insert into spital.audit_trail(idfoaie, actiune, user, data, tip) values (" +  idfoaie + ", '"+ action + "', '" +  req.session.userid + "', '" + new Date().toLocaleString()  + "','foaie')", function (errFinal, resultFinal){
                                             if (errFinal) throw errFinal;
                                             con.end();
                                     });
                                     res.redirect('/fisa_terapie?idfoaie='+ idfoaie + '&idfisa=' + id);
                                     });

                      });
});
function createComments(){
    comms = [];
    for(var i=0;i<24;i++){
           var oraV =  i;
           if (oraV.length<2)
                oraV = "0"+i;
           comms.push(new Comment(oraV,'','','','','',''));
    }
return comms;
}
   var idpacient;
router.get('/', (req, res) => {
 if (req.session==undefined  || req.session.userid==undefined) {
    res.redirect('/users/login');
    return;
  };
    const query = url.parse(req.url, true).query;
    var data = query.data;
    var pacientName = query.pacient;
    var idfoaie = query.idfoaie;

    var idfisa = query.idfisa;

    if (idfoaie!=undefined) {

    arsuri = [];
    var sql = "SELECT p.idpacient as idpacient, prenume, numefamilie, p.zi, p.luna, p.an, sex, cnp, cod, f.medic as medic, f.sectia as sectia, f.salon as salon, f.arsuri as arsuri, f.sange, f.rh, f.diagnosticprincipal  FROM spital.pacient p left join spital.foaie_observatie f on f.idpacient = p.idpacient where p.idpacient=(select idpacient from spital.foaie_observatie where idfoaie_observatie=" + idfoaie + ")";
    var row1col1=row1col2=row1col3=
        row2col1=row2col2=row2col3=
        row3col1=row3col2=row3col3=
        row4col1=row4col2=row4col3=
        row5col1=row5col2=row5col3=
        row6col1=row6col2=row6col3=
        row7col1=row7col2=row7col3="";
    var con = mysql.createConnection({
            host: Global.getHost(),
            user: Global.getUser(),
            password: Global.getParola()
          });
      con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result, fields) {
          if (err) throw err;

           if (result[0]!=null) {
                  salon = result[0].salon;
                  nrFo = idfoaie;
                  nume = result[0].numefamilie;
                  prenume = result[0].prenume;
                  varsta  = Global.calculateAge(result[0].zi, result[0].luna, result[0].an);
                  idpacient = result[0].idpacient;
                  rh = Global.checkNull(result[0].sange).toUpperCase() + " " + Global.checkNull(result[0].rh);
                  diagnostic = result[0].diagnosticprincipal;
                  var arsuriList = JSON.parse(result[0].arsuri);
                                    if (arsuriList!=undefined) {
                                    for (var i=0;i<arsuriList.length;i++){
                                      arsuri.push(new Global.Arsura(arsuriList[i].position, arsuriList[i].grad, arsuriList[i].localizare, arsuriList[i].procent));
                                    }
                                    }
                                    else {

                                    }
                  pacient = {idpacient, nume, prenume, varsta, rh, diagnostic};
                  if (idfisa!=undefined) {
                        var selectFisa = "select * from spital.fisa_terapie_intensiva where idfisa_terapie_intensiva=" + idfisa;
                        con.query(selectFisa, function (err, result, fields) {
                                   if (err) throw err;
                                   if (result[0]!=null) {
                                           data = result[0].data;
                                           row1col1=result[0].row1col1;
                                           row1col2=result[0].row1col2;
                                           row1col3=result[0].row1col3;
                                           row2col1=result[0].row2col1;
                                           row2col2=result[0].row2col2;
                                           row2col3=result[0].row2col3;
                                           row3col1=result[0].row3col1;
                                           row3col2=result[0].row3col2;
                                           row3col3=result[0].row3col3;
                                           row4col1=result[0].row4col1;
                                           row4col2=result[0].row4col2;
                                           row4col3=result[0].row4col3;
                                           row5col1=result[0].row5col1;
                                           row5col2=result[0].row5col2;
                                           row5col3=result[0].row5col3;
                                           row6col1=result[0].row6col1;
                                           row6col2=result[0].row6col2;
                                           row6col3=result[0].row6col3;
                                           row7col1=result[0].row7col1;
                                           row7col2=result[0].row7col2;
                                           row7col3=result[0].row7col3;


                                           comments = JSON.parse(result[0].comments);
                                           if (comments==undefined || comments == null) {
                                                comments = createComments();
                                             }
                                             else {

                                             }




                                                         fisa = {salon, data, nrFo};

                                                         detaliiFisa = {row1col1,row1col2,row1col3,
                                                                       row2col1,row2col2,row2col3,
                                                                       row3col1,row3col2,row3col3,
                                                                       row4col1,row4col2,row4col3,
                                                                       row5col1,row5col2,row5col3,
                                                                       row6col1,row6col2,row6col3,
                                                                       row7col1,row7col2,row7col3,
                                                                         };

                                                         res.render('fisaterapie', {fisa, pacient,detaliiFisa, comments, arsuri} );




                                                     con.end();
                                   }
                                   else {
                                         comments = createComments();
                                        fisa = {salon, data, nrFo};
                                        res.render('fisaterapie', {fisa, pacient, comments} );
                                        con.end();
                                   }
                                   });

                  }
                   else {
                        comments = createComments();
                        fisa = {salon, data, nrFo};
                        res.render('fisaterapie', {fisa,pacient, comments} );
                                                                con.end();
                   }

              }
              else {
                res.render('fisaterapie');
              }
              //end init

        });
        });
    //init
    }
    else{
        res.send("Fișa de terapie nu a putut fi generată, pentru că id-ul foii de observație nu a fost găsit în query string (adică adresa arată așa: https://site/foaie_observatie , fără '?pacient=numar'). Reîncărcați aplicația, selectați un pacient din listă și alegeți o foaie de observație sau generați una nouă din buton");

    }

});




module.exports = router;