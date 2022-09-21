const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const config = require('config');
var mysql = require('mysql');
const url = require('url');
const Sequelize = require('sequelize');
const User = require('../models/User');
var taskController = require("../controllers/circle_json_ctrl");
const Op = Sequelize.Op;
var Global = require("../functions.js");
//Use this class for interface functions & put ur json api in controllers/users_json_ctrl
console.log("routes/users.js");
// router.route('/demoadd').get(taskController.demoadd);
Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this))
};

function test(results){
    return Object.values(JSON.parse(JSON.stringify(results)));
};
// Get user list
router.get('/', (req, res) => {
  const query = url.parse(req.url, true).query;
  const data = query.data;
  var nume = query.nume;
  var email = query.email;
  var rol = query.rol;
  var alreadyFiltered =false;
  var sql = "SELECT idutilizator, nume, email, rol FROM spital.utilizator";
  if (query.nume!=null) {
      sql = Global.appendToSQL(sql, alreadyFiltered, "nume",query.nume);
      alreadyFiltered = true;
  }
  if (query.rol!=null) {
        sql = Global.appendToSQL(sql, alreadyFiltered, "rol",query.rol);
        alreadyFiltered = true;
  }
  if (query.email!=null) {
        sql = Global.appendToSQL(sql, alreadyFiltered, "email",query.email);
        alreadyFiltered = true;
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
      console.log(result);
      con.end();
      res.render('users', result  );
    });
  });

});


router.get('/json', (req, res) => {
  res.contentType('application/json');
  res.removeHeader;
  var result = [];
  User.findAll()
    .then(
      c => {

        res.json({ c })

        console.log('result: ' + result + ' ');
      })

    .catch(err => console.log(err));
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
  User.findOne({ where: { email: req.body.email, acctype : 'Email' } }).then(async function (userFound) {
    if (userFound==null){
      errortext = config.get('password.nouserfound');
      res.render('resetpassword', {
        errortext,
        email, currentpassword, newpassword,
        query: {email: email}
      }
      )
    }
    else{
      console.log("new pass: " + currentpassword + " " + userFound.pass);
      if (await bcrypt.compare(currentpassword, userFound.pass)) {

        console.log("new pass: " + newpassword);
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        userFound.update({
          pass: hashedPassword
        });
        errortext = config.get('password.successfulchange') + email;
        res.render('resetpassword', {
          errortext,
          email, currentpassword, newpassword,
          query: {email: email}
        });
      }
      else{
        errortext = config.get('password.incorrectpassword')  + email;
        res.render('resetpassword', {
          errortext,
          email, currentpassword, newpassword,
          query: {email: email}
        });
    }
    }
  });
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
router.get('/adduser', (req, res) => {
  const query = url.parse(req.url, true).query;
  const data = query.data;
  const id = query.id;
  if (id!=null) {
  var con = mysql.createConnection({
              host: Global.getHost(),
              user: Global.getUser(),
              password: Global.getParola(),
              port: 3306
              });
          var select = "SELECT * FROM spital.utilizator where idutilizator=" + id+"";
          console.error(select);

          var nume;
          var email;
          var rol;
          var parola;
          var parolaConfirm;
          con.query(select, (error, results, fields) => {
            if (error) {

              return console.error(error.message);
            }
             console.error(results);
             console.error(results[0]);
             console.error(results[0].nume);
             nume=results[0].nume;
             email=results[0].email;
             rol=results[0].rol;
             parola=results[0].parola;
             parolaConfirm = parola;
             con.end();
             res.render('adduser',{nume, email, rol, parola, parolaConfirm});
            });
    }
    else{
      res.render('adduser');
    }
});

// Add a gig
router.post('/adduser', (req, res) => {
  let errors = [];
  let { nume, email, rol, parola, parolaConfirm} = req.body;
    if (nume.trim()=='') {
    errors.push ({"text": "Numele nu este completat"});
      };
    if (email.trim()=='') {
      errors.push ({"text": "E-mailul nu este completat"});
      };
    if (rol.trim()=='') {
          errors.push ({"text": "Rolul nu este completat"});
      };
    if (parola.trim()=='') {
            errors.push ({"text": "Parola nu este completată"});
      };
    if (parolaConfirm.trim()=='') {
                errors.push ({"text": "Câmpul 'Confirmă Parola' nu este completat"});
      };
    if (parolaConfirm.trim()!=parola.trim()) {
                    errors.push ({"text": "Câmpul 'Confirmă Parola' e diferit de câmpul 'Parola'"});
          };
    if (parola.length<8) {
        errors.push ({"text": "Câmpul 'Parola' trebuie să aibă minim 8 caractere!"});
    }
    // Check for errors
    if (errors.length > 0) {
      res.render('adduser', {
        errors,
        nume, rol, email
      });
    } else {

      var con = mysql.createConnection({
            host: Global.getHost(),
            user: Global.getUser(),
            password: Global.getParola(),
            port: 3306
            });
      con.connect(function(err) {
      if (err) throw err;
      console.log("Connected to add user!");
      });
        var select = "SELECT * FROM spital.utilizator where nume='" + nume+"'";

        var sizeOfSelect = 0;
        con.query(select, (error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          sizeOfSelect = results.length;
          if (sizeOfSelect==0) {
                             var sql = "INSERT INTO spital.utilizator (nume, email, rol, parola) VALUES ?";
                             var values = [
                             [nume, email, rol, parola]
                             ];
                             con.query(sql, [values], function (err, result) {
                             if (err) throw err;
                             console.log("Number of records inserted: " + result.affectedRows);
                             errors.push ({"text": "Utilizatorul " + nume + " a fost creat în bază."});
                             res.render('adduser', {errors,nume, rol, email});
                             });
                  }
                  else {
                     var sql = "Update spital.utilizator set email = '" + email + "', rol='" +rol + "', parola='" + parola + "' where nume='" + nume + "'";
                      con.query(sql, function (err, result) {
                         if (err) throw err;
                         console.log(result.affectedRows + " record(s) updated");
                         errors.push ({"text": "Utilizatorul " + nume + " există în baza de date: a fost actualizat cu noile informații."});
                       });
                      res.render('adduser', {
                              errors,
                              nume, rol, email
                            });
                  }
                  con.end();
        });

    }
});


module.exports = router;