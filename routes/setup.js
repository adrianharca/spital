const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const config = require('config');
var mysql = require('mysql');
const url = require('url');
const Sequelize = require('sequelize')
var Global = require("../functions.js");
//Use this class for interface functions & put ur json api in controllers/users_json_ctrl
console.log("routes/setup.js");
// router.route('/demoadd').get(taskController.demoadd);

router.get('/', (req, res) => {

  var sql = "SELECT * FROM spital.setup";


  var con = mysql.createConnection({
      host: Global.getHost(),
      user: Global.getUser(),
      password: Global.getParola()
      });
  con.connect(function(err) {
    if (err) throw err;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      con.end();
      var setup = {};
      if (result[0]!=undefined) {

        setup.roles = result[0].roles;
        setup.levels = result[0].levels;
        if (result[0].sectii!=undefined)
            setup.sectiiJsonVar = result[0].sectii;
        else
            setup.sectiiJsonVar = [];
        }
        res.render('setup',{ setup}  );
    });
  });

});

// // Display setup form
router.post('/', (req, res) => {
  const query = url.parse(req.url, true).query;

  errors = [];
  setup = {};
  setup.roles = req.body.roles;
  setup.levels = req.body.levels;
  var indexSectie = 0;
  var sectii = [];
  while (req.body["nume"+indexSectie]!=undefined || req.body["saloane"+indexSectie]!=undefined ){
          sectii.push(new Global.Sectie(indexSectie, req.body["nume"+indexSectie], req.body["saloane"+indexSectie]));
          indexSectie++;
  }
  setup.sectiiJsonVar = JSON.stringify(sectii);
  
  if (req.body.roles=='') {
                errors.push ({"text": "Rolurile nu sunt completate."});
                res.render('setup',{errors, setup});
                return;
                  };
  if (req.body.levels=='') {
                  errors.push ({"text": "Nivelurile de studii nu sunt completate."});
                  res.render('setup',{errors, setup});
                  return;
                    };
  var rolesList = req.body.roles.toLowerCase().split(",");
  var foundAdmin = false;
  var foundMedic = false;
  for(var i=0;i<rolesList.length;i++){
    if (rolesList[i].trim().localeCompare("medic")==0)
        foundMedic = true;
    if (rolesList[i].trim().localeCompare("admin")==0)
        foundAdmin = true;

  }
  if (!foundAdmin || !foundMedic) {
        errors.push ({"text": "Rolurile medic și admin trebuie să existe în cadrul listei de roluri."});
        res.render('setup',{errors, setup});
        return;
  }

  if (indexSectie==0){
        errors.push ({"text": "Completați configurația cu cel puțin o secție."});
        res.render('setup',{errors, setup});
        return;
  }
  modifieddate= creationdate = new Date();

  var con = mysql.createConnection({
              host: Global.getHost(),
              user: Global.getUser(),
              password: Global.getParola(),
              port: 3306
              });
          var select = "SELECT * FROM spital.setup";

          con.query(select, (error, results, fields) => {
            if (error) {

              return console.error(error.message);
            }
             var sizeOfSelect = results.length;

             if (sizeOfSelect==0)  {
                    updateInsertSql = "insert into spital.setup(roles, modifieddate, creationdate, sectii, levels) values ('"+ req.body.roles + "','" +modifieddate + "','" + creationdate+"','" + JSON.stringify(sectii)+"','" + req.body.levels + "')";
             }
             else {
                    updateInsertSql =  "update spital.setup set roles='" + req.body.roles + "', modifieddate='" + modifieddate+ "', sectii='"+ JSON.stringify(sectii) + "', levels='" + req.body.levels + "'";
             }
             var setup = {};
             con.query(updateInsertSql, (error2, results2, fields2) => {
                                   if (error2) {
                                               return console.error(error2.message);
                                   }

                                    res.render('setup',{errors, setup});
                                   });


            });

});


module.exports = router;