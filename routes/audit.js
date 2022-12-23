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
  var idfoaie = query.idfoaie;
  var tipulArticulat;
  var tip;
  if (query.idfoaie!=undefined) {
    tip = "foaie";
    tipulArticulat = "foaia";
    idfoaie = query.idfoaie;
  }
  else if (query.iduser!=undefined) {
     tip = "user";
     tipulArticulat= "utilizatorul";
     idfoaie = query.iduser;
  }
  else if (query.idpacient!=undefined) {
    tip = "pacient";
    tipulArticulat= "pacientul";
    idfoaie = query.idpacient;
  }
  selectAuditRecords = "select * from spital.audit_trail where idfoaie= " + idfoaie + " and tip='"+tip +"' order by STR_TO_DATE(data, '%d/%m/%Y, %h:%i:%s %p') desc";
  var con = Global.createConnection(mysql);
           con.connect(function(err) {
             if (err) throw err;
             con.query(selectAuditRecords, function (err, result, fields) {
               if (err) throw err;

                res.render('audit',{result,tipulArticulat, idfoaie});
               con.end();
             });
             });
});

module.exports = router;