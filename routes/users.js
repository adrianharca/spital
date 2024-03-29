const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const config = require('config');
var mysql = require('mysql');
const url = require('url');
var crypto = require('crypto');
const Sequelize = require('sequelize');
const User = require('../models/User');
var taskController = require("../controllers/circle_json_ctrl");
const Op = Sequelize.Op;
var Global = require("../functions.js");
//Use this class for interface functions & put ur json api in controllers/users_json_ctrl
console.log("routes/users.js");
const session = require('express-session');
// router.route('/demoadd').get(taskController.demoadd);
Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this))
};

function test(results){
    return Object.values(JSON.parse(JSON.stringify(results)));
};

router.get('/delete', (req,res) => {
    const query = url.parse(req.url, true).query;
    const data = query.data;
    var id = query.iduser;
    if (req.session.isAdmin==undefined) {
                    res.redirect('/');
                    return;
    };
    console.log("id deleted: " + id);
    if (id!=undefined){
        var con = Global.createConnection(mysql);
              deleteSql = "delete from spital.utilizator where idutilizator=" + id;
          con.connect(function(err) {
            if (err) throw err;
            con.query(deleteSql, function (err, result, fields) {
              if (err) throw err;
              con.end();
              res.redirect('/users' );
            });
          });

    }
    else {
       res.redirect('/users' );
    }

});

// Get user list
router.get('/', (req, res) => {
if (req.session==undefined  || req.session.userid==undefined) {
    res.redirect('/users/login');
    return;
  };
  if (req.session.isAdmin==undefined) {
              res.redirect('/');
              return;
  };
  const query = url.parse(req.url, true).query;
  var page = !query.page ? 0 : parseInt(query.page);
  const data = query.data;
  var nume = query.nume;
  var email = query.email;
  var rol = query.rol;
  var alreadyFiltered = false;
  var sql = "SELECT idutilizator, nume, email, rol, counttable.nr  FROM spital.utilizator join (select count(*) as nr from spital.utilizator) as counttable";

  var limit = Global.limitRecords();

  if (query.nume!=null) {
      sql = Global.appendToSQL(sql, alreadyFiltered, "nume",query.nume);
      alreadyFiltered = true;
  }
  if (query.rol != null) {
    sql = Global.appendToSQL(sql, alreadyFiltered, "rol", query.rol);
    alreadyFiltered = true;
  }
  if (query.email != null) {
    sql = Global.appendToSQL(sql, alreadyFiltered, "email", query.email);
    alreadyFiltered = true;
  }

  sql = sql + " order by idutilizator limit " + limit;
  if (page != null) {
    sql = sql + " offset " + page * limit;
  }

  var con = Global.createConnection(mysql);
  con.connect(function (err) {
      if (err) throw err;
      con.query(sql, function (err, result, fields) {
      if (err) throw err;
      result.page = page;
      if (result[0]!=undefined)
        result.showNext = result[0].nr - limit > 0 & page + 1 < result[0].nr / limit;
      else
        result.showNext = false;
      result.showPrev = page != 0;
      res.render('users', result);
      con.end();

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
var roles;
router.get('/adduser', (req, res) => {


  const query = url.parse(req.url, true).query;
  id = query.iduser;
  var con = Global.createConnection(mysql);
  iduser = id;
  if (id!=null) {
          var select = "select * from (SELECT * FROM spital.utilizator where idutilizator=" + id+") t join spital.setup";
          var nume;
          var email;
          var rol;
          var parola;
          var parolaVeche;
          var parolaConfirm;

          con.query(select, (error, results, fields) => {
            if (error) {

              return console.error(error.message);
            }
             nume=results[0].nume;
             email=results[0].email;
             rol=results[0].rol.split(",").map(string => string.trim());
             parolaVeche=results[0].parola;
             parolaConfirm = parola;
             roles = results[0].roles.split(",").map(string => string.trim());
             roles = roles.filter( function( el ) {
                            return !rol.includes( el );
                          } );

             con.end();
             res.render('adduser',{nume, email, rol, parola, parolaVeche, parolaConfirm, roles, iduser});
            });
    }
    else{
      var select = "select * from spital.setup";
      con.query(select, (error, results, fields) => {
          if (error) {

              return console.error(error.message);
          }
          roles = results[0].roles.split(",");
          con.end();
          res.render('adduser',{roles});
      });

    }
});
var id = null;
router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/users/login');
});
router.get('/login', (req, res) => {
           res.render('login' );
   });
router.post('/login', (req, res) => {
        let errors = [];
        let username = req.body.username;
        let password = req.body.parola;
        if (username==undefined || username.trim()=='') {
             errors.push ({"text": "Numele nu este completat"});
         };

         if (password==undefined || password.trim()=='') {
              errors.push ({"text": "Parola nu este completată"});
         };
         if (errors.length>0) {
             res.render('login',{errors} );
             return;
             }
         if (username== Global.getRootUser() && crypto.createHash('md5').update(password).digest('hex')==Global.getRootMD5Password()) {
             req.session.loggedin = true;
             req.session.userid=req.body.username;
             req.session.roles = "admin,medic";
             req.session.isMedic = true;
             req.session.isAdmin = true;
             res.redirect('/pacients');
             return;
         }
         else {
         sql = "select * from spital.utilizator where nume='" + username + "' and parola=MD5('" + password + "')";
         var con = Global.createConnection(mysql);
               con.connect(function(err) {
               if (err) throw err;
               });



               var sizeOfSelect = 0;

               con.query(sql, (error, results, fields) => {
                  if (results!=undefined)
                      sizeOfSelect = results.length;
                      if (sizeOfSelect==0){
                            errors.push ({"text": "Combinația utilizator/parolă este greșită."});
                            res.render('login',{errors} );
                    }
                    else {
                        req.session.userid=req.body.username;
                        req.session.roles = results[0].rol;
                        req.session.userid=results[0].idutilizator;
                        req.session.profile = true;

                        if (results[0].rol.includes("admin")) {
                            req.session.isAdmin = true;
                        }

                        if (results[0].rol.includes("medic")) {
                            req.session.isMedic = true;
                        }

                        req.session.loggedin = true;
                        res.redirect('/pacients');
                    }
                 });
        }
    });
// Add an user
router.post('/adduser', (req, res) => {
  let errors = [];
   const query = url.parse(req.url, true).query;
  nume= req.body.nume;
  email = req.body.email;
  parola = req.body.parola;
  parolaOld = req.body.parolaOld;
  parolaVeche = req.body.parolaVeche;
  parolaConfirm = req.body.parolaConfirm;
    if (nume.trim()=='') {
    errors.push ({"text": "Numele nu este completat"});
      };
    if (email.trim()=='') {
      errors.push ({"text": "E-mailul nu este completat"});
      };
    var body = JSON.parse(JSON.stringify(req.body));
    var noRole = true;
    var finalRoles = [];
    var finalRolesString = "";
    if (req.session.userid!=undefined) {
    for(var key in body) {

      if(body.hasOwnProperty(key)){
            if (key.includes("role")) {
                noRole = false;
                finalRoles.push(req.body[key]);
            }
            item = req.body[key];
      }
    }
    finalRolesString = finalRoles.join(",");
    if (noRole==true) {
          errors.push ({"text": "Rolul nu este completat"});
      };
    }
    var changingpassw = req.body.ispasswchanged;
    if (changingpassw.localeCompare("true")==0) {
        if (parolaOld.trim()=='') {
                    errors.push ({"text": "Parola veche nu este completată. Trebuie să introduceți parola veche " +
                    "din nou pentru schimbarea parolei"});
                };
        var hash = crypto.createHash('md5').update(parolaOld).digest('hex');
        
        if (hash.localeCompare(parolaVeche)!=0) {
                 errors.push ({"text": "Parola veche nu este cea corectă. Vă rog să o introduceți din nou."});
        }
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
    }
    rol = finalRoles[0];
    if (id==undefined)
        id= -1;
    // Check for errors
    if (errors.length > 0) {
      res.render('adduser', {
       iduser: id,
        errors,
        nume, email,rol, roles, finalRolesString
      });
    } else {

      var con = Global.createConnection(mysql);
      con.connect(function(err) {
      if (err) throw err;
      console.log("Connected to add user!");
      });

        var select = "SELECT * FROM spital.utilizator where idutilizator=" + id;

        var sizeOfSelect = 0;
        con.query(select, (error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          sizeOfSelect = results.length;

          if (sizeOfSelect==0) {
                             var sql = "INSERT INTO spital.utilizator (nume, email, rol, parola) VALUES ('" + nume+ "','"+ email +"','"+ finalRolesString+ "',MD5('"+ parola + "'))";


                             con.query(sql, function (err, result) {
                             if (err) throw err;
                             console.log("Number of records inserted: " + result.affectedRows);
                             Global.insertIntoAudit(con,  result.insertId, 'creare', req.session.userid, new Date(),'user');
                             errors.push ({"text": "Utilizatorul " + nume + " a fost creat în bază."});
                             parolaConfirm = parola;
                             res.redirect('/users');
                             });
                  }
                  else {
                     var sql;
                     if (changingpassw.localeCompare("true")==0) {
                         sql = "Update spital.utilizator set email = '" + email + "', rol='" + finalRolesString + "', parola=MD5('" + parola + "'), nume='" + nume + "' where idutilizator='" + id + "'";
                       }
                    else {
                         sql = "Update spital.utilizator set email = '" + email + "', rol='" + finalRolesString + "', nume='" + nume + "' where idutilizator='" + id + "'";
                    }
                      var action = Global.appendToAuditTrailString(results[0], body,"email","email" );
                                             action = action + Global.appendToAuditTrailString(results[0], body,"nume","nume" );

                                             if (finalRolesString.toString().localeCompare(results[0].rol)!=0){
                                                action = action + "rol: " + results[0].rol + " -> " + finalRolesString + "<br>";
                                             }
                                             Global.insertIntoAudit(con, id, action, req.session.userid, new Date(),'user');
                      con.query(sql, function (err, result) {
                         if (err) throw err;
                         if (changingpassw.localeCompare("true")==0) {
                            console.log(result.affectedRows + " record(s) updated with password");
                         }
                         else {
                            console.log(result.affectedRows + " record(s) updated without password");
                         }

                         errors.push ({"text": "Utilizatorul " + nume + " există în baza de date: a fost actualizat cu noile informații."});
                       });
                      res.redirect('/users');
                  }
                  con.end();
        });

    }
});


module.exports = router;