const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Sequelize = require('sequelize');
const User = require('../models/User');
var taskController = require("../controllers/circle_json_ctrl");
const Op = Sequelize.Op;

//Use this class for interface functions & put ur json api in controllers/users_json_ctrl
console.log("routes/users.js");
router.route('/demoadd').get(taskController.demoadd);


// Get user list
router.get('/', (req, res) => {

  User.findAll()
  .then(c => {
    res.render('users', { c });
    console.log('user found');
  })
  .catch(err => console.log(err));
});


router.get('/json', (req, res) => {
  res.contentType('application/json');
  res.removeHeader;
  var result=[];
  User.findAll()
    .then(
      c => {
        
       res.json({c})
    
      console.log('result: ' + result + ' ');
    })
  
    .catch(err => console.log(err));
});


// // Display add user form
router.get('/adduser', (req, res) => res.render('adduser'));

// Add a gig
router.post('/adduser', (req, res) => {
  let { firstname, lastname, email } = req.body;
  let errors = [];


  // Check for errors
  if (errors.length > 0) {
    res.render('adduser', {
      errors,
      firstname, lastname, email
    });
  } else {


    // Make lowercase and remove space after comma
    //  technologies = technologies.toLowerCase().replace(/, /g, ',');

    // Insert into table
    User.create({
      firstname, lastname, email
    })
      .then(a => {
        console.log('success');
        res.redirect('/users')
      })
      .catch(err => console.log(err));

  }
});


module.exports = router;