const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
var mysql = require('mysql');
const config = require('config');
const Sequelize = require('sequelize');
const User = require('../models/User');
const url = require('url');
var taskController = require("../controllers/circle_json_ctrl");
var idInUI=null;
var Global = require("../functions.js");
const Op = Sequelize.Op;

//Use this class for interface functions & put ur json api in controllers/users_json_ctrl
console.log("routes/pacients.js");
// router.route('/demoadd').get(taskController.demoadd);


// Get user list
router.get('/', (req, res) => {
  const query = url.parse(req.url, true).query;
  const data = query.data;
  const page = query.page;
  const sorting = query.sortBy;
  var alreadyFiltered =false;
  var sql = "SELECT idpacient, numefamilie, prenume, sex, cetatenie FROM spital.pacient order by idpacient limit 100";
    if (page!=null) {
     sql = sql + " offset " + page*100;
    }
  if (query.numefamilie!=null) {
          sql = sql + " where numefamilie='" + query.numefamilie + "'";
          alreadyFiltered = true;
    }
    if (query.prenume!=null) {
          sql = Global.appendToSQL(sql, alreadyFiltered, "prenume",query.prenume);
          alreadyFiltered = true;
    }
    if (query.sex!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "sex",query.sex);
            alreadyFiltered = true;
     }
     if (query.cetatenie!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "cetatenie",query.cetatenie);
            alreadyFiltered = true;
     }
     if (query.cnp!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "cnp",query.cnp);
            alreadyFiltered = true;
     }
      if (query.cod!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "cod",query.cod);
            alreadyFiltered = true;
      }
      if (query.cnpParinte!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "cnpParinte",query.cnpParinte);
            alreadyFiltered = true;
      }
      if (query.localitatea!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "localitatea",query.localitatea);
            alreadyFiltered = true;
      }
      if (query.localitateaRes!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "localitateaRes",query.localitateaRes);
            alreadyFiltered = true;
      }
      if (query.judet!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "judet",query.judet);
            alreadyFiltered = true;
      }
      if (query.judetRes!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "judetRes",query.judetRes);
            alreadyFiltered = true;
      }
      if (query.mediu!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "mediu",query.mediu);
            alreadyFiltered = true;
      }
      if (query.mediuRes!=null) {
            sql = Global.appendToSQL(sql, alreadyFiltered, "mediuRes",query.mediuRes);
            alreadyFiltered = true;
      }
    if (sorting!=null) {
        sql = sql + " order by " + sorting;
        if (query.sortingOrder!=null) {
                    sql = sql + " " + query.sortingOrder;
                }
    }

 var con = mysql.createConnection({
        host: Global.getHost(),
        user: Global.getUser(),
        password: Global.getParola()
      });
  con.connect(function(err) {
    if (err) throw err;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.render('pacients', result  );
      con.end();
    });
    });
});


router.get('/json', (req, res) => {
  res.contentType('application/json');
  res.removeHeader;
  var result = [];
  res.json({ });

});

// // Display add user form
router.get('/resetpassword', async function(req,res) {
  
  res.render('resetpassword',{
    query: req.query
  })
  
});
router.post('/resetpassword',async function(req,res){
  try {
let {email, currentpassword,newpassword,confirmpassword} = req.body;
let errortext = "";
let queryParam = req.query;
if (email==""){
  errortext = config.get('password.noemail');
}
else if (currentpassword==""){
  errortext = config.get('password.nopassword');
 
}
else if (newpassword==""){
  errortext = config.get('password.nonewpassword');
 
}
else if (currentpassword==newpassword){
  errortext = config.get('password.samepassword');
}
else if (confirmpassword!=newpassword){
  errortext = config.get('password.samenewpasswords');
}



if (errortext.length > 0) {
  res.render('resetpassword', {
    errortext,
    email, currentpassword, newpassword,
    query: {email: email}
  }
  );
} 
else {
    res.render('resetpassword');
}

  }
  catch(e){
    errortext = "Error changing password for user "  + email + ": "  + JSON.stringify(e);
    res.render('resetpassword', {
      errortext,
      email, currentpassword, newpassword,
      query: {email: email}
    });
  }    
  });
// // Display add user form

router.get('/addpacient', (req, res) => {
 const query = url.parse(req.url, true).query;
 var id = query.id;
 idInUI = id;
 if (id!=null) {
      var con = mysql.createConnection({
            host: Global.getHost(),
            user: Global.getUser(),
            password: Global.getParola(),
            port: 3306
            });
      con.connect(function(err) {
      if (err) throw err;

      });
      var select = "SELECT * FROM spital.pacient where idpacient=" + id;
      con.query(select, (error, results, fields) => {
          if (error) {
                      return console.error(error.message);
          }
          var numefamilie=results[0].numefamilie;
          var prenume=results[0].prenume;
          var telefon=results[0].telefon;
          var email=results[0].email;
          var sex = results[0].sex;
          var cnp = results[0].cnp;
          var cetatenie = results[0].cetatenie;
          var zi = results[0].zi;
          var luna = Global.convertNumberToMonth(results[0].luna);
          var an = results[0].an;
          var greutatenastere = results[0].greutatenastere;
          var judet = results[0].judet;
          var localitatea = results[0].localitatea;
          var mediu = results[0].mediu;
          var strada = results[0].strada;
          var numar = results[0].numar;
          var judetRes = results[0].judetRes;
          var localitateaRes = results[0].localitateaRes;
          var mediuRes = results[0].mediuRes;
          var stradaRes = results[0].stradaRes;
          var numarRes = results[0].numarRes;
          var parinte = results[0].parinte;
          var cnpParinte = results[0].cnpParinte;
          var cnpParinte = results[0].cnpParinte;
          var foParinte = results[0].foParinte;
          var ocupatieParinte = results[0].ocupatieParinte;
          var serviciuParinte = results[0].serviciuParinte;
          var studii = results[0].studii;
          var cod = results[0].cod;
          var idInUI = id;
          var select = "SELECT idfoaie_observatie, idpacient, medic, sectia, CURRENT_TIMESTAMP as timeCol FROM spital.foaie_observatie where idpacient=" + id;
                con.query(select, (error, results, fields) => {
                    if (error) {
                                return console.error(error.message);
                    }
                    var foaie;
                    if (results.length!=0) {
                        foaie = results;
                    }
                    res.render('addpacient',{numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, luna, an, greutatenastere,
                        judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,
                        foParinte, ocupatieParinte, serviciuParinte, studii, cod,idInUI,foaie });
                    });
          con.end();

      });

    }
    else {
        cetatenie = "Română";
        res.render('addpacient',{cetatenie});
  }
});

// Add a gig
router.post('/addpacient', (req, res) => {
  let errors = [];
let { numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, luna, an, greutatenastere,
  judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,
  foParinte, ocupatieParinte, serviciuParinte, studii, cod} = req.body;
  if (numefamilie=='') {
  errors.push ({"text": "Numele de familie nu este completat"});
    };
  if (prenume=='') {
    errors.push ({"text": "Prenumele nu este completat"});
    };
  if (sex=='') {
        errors.push ({"text": "Sexul nu este completat"});
    };
  if (cetatenie=='') {
          errors.push ({"text": "Cetățenia nu este completată"});
    };
  if (zi==''){
    zi = null;
  }
  if (luna==''){
      luna = null;
  }
  if (an==''){
        an = null;
  }
  // Check for errors
  if (errors.length > 0) {
    res.render('addpacient', {
      errors,
      prenume, numefamilie, email,cetatenie
    });
  } else {

 var con = mysql.createConnection({
             host: Global.getHost(),
             user: Global.getUser(),
             password: Global.getParola(),
             port: 3306
             });
 if (idInUI!=null) {

      con.connect(function(err) {
      if (err) throw err;
      });
      var select = "SELECT * FROM spital.pacient where idpacient=" + idInUI;
      var sizeOfSelect = 0;
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
                    console.log("Connected to add patient!");
        });
        if (sizeOfSelect==0) {
          var sql = "INSERT INTO spital.pacient ( numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, luna, an, greutatenastere, judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,foParinte, ocupatieParinte, serviciuParinte, studii, cod) VALUES ?";
              var values = [
              [numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, Global.convertLuna(luna), an, greutatenastere,
                 judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,
                 foParinte, ocupatieParinte, serviciuParinte, studii, cod]
              ];
              con.query(sql, [values], function (err, result) {
              if (err) throw err;
                con.end();
                res.redirect("../pacients");
              });
        }
        else {
            var sql = "Update spital.pacient set numefamilie = '" + numefamilie +
             "', prenume='" +prenume + "', telefon='" + telefon + "' " +
             ", email='" +email + "', sex='" + sex + "' " +
             ", cnp='" +cnp + "', cetatenie='" + cetatenie + "' " +
             ", zi=" +zi + ", luna=" + Global.convertLuna(luna)  +
             ", an=" +an + ", greutatenastere='" + greutatenastere + "' " +
             ", judet='" +judet + "', localitatea='" + localitatea + "' " +
             ", mediu='" +mediu + "', strada='" + strada + "' " + ", numar='" +numar + "', judetRes='" + judetRes + "' " +
             ", localitateaRes='" +localitateaRes + "', mediuRes='" + mediuRes + "' " + ", stradaRes='" +stradaRes + "', numarRes='" + numarRes + "' " +
             ", parinte='" +parinte + "', cnpParinte='" + cnpParinte + "', foParinte='" +foParinte + "', ocupatieParinte='" + ocupatieParinte + "' " +
             ", serviciuParinte='" +serviciuParinte + "', studii='" + studii + "', cod='" +cod + "', ocupatieParinte='" + ocupatieParinte + "' "
             + " where idpacient=" + idInUI;
            con.query(sql, function (err, result) {
            if (err) throw err;
            errors.push ({"text": "Pacientul " + numefamilie + " există în baza de date: a fost actualizat cu noile informații."});
            });
            con.end();
            res.render('addpacient', {errors,numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, luna, an, greutatenastere,
                                                           judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,
                                                           foParinte, ocupatieParinte, serviciuParinte, studii, cod});
        }

        });
      }
      else{
       var sql = "INSERT INTO spital.pacient ( numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, luna, an, greutatenastere, judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,foParinte, ocupatieParinte, serviciuParinte, studii, cod) VALUES ?";
                    var values = [
                    [numefamilie, prenume, telefon, email, sex, cnp, cetatenie, zi, Global.convertLuna(luna), an, greutatenastere,
                       judet, localitatea, mediu, strada, numar, judetRes, localitateaRes, mediuRes, stradaRes, numarRes, parinte, cnpParinte,
                       foParinte, ocupatieParinte, serviciuParinte, studii, cod]
                    ];
                    con.query(sql, [values], function (err, result) {
                    if (err) throw err;
                      con.end();
                      res.redirect("../pacients");
                    });

      }



  }
});


module.exports = router;