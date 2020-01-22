const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Sequelize = require('sequelize');
const User = require('../models/User');
const Vote = require('../models/Vote');
var taskController = require("../controllers/circle_json_ctrl");
const Op = Sequelize.Op;

//Use this class for interface functions & put ur json api in controllers/vote_json_ctrl
console.log("routes/votes.js");


// Get vote list
router.get('/', (req, res) => {

  Vote.findAll()
  .then(c => {
    res.render('votes', { c });
    console.log('displayed votes');
  })
  .catch(err => console.log(err));
});


router.get('/json', (req, res) => {
  res.contentType('application/json');
  res.removeHeader;
  var result=[];
  Vote.findAll()
    .then(
      c => {
        
       res.json({c})
    
      console.log('result: ' + result + ' ');
    })
  
    .catch(err => console.log(err));
});


// // Display add user form
router.get('/addVote', (req, res) => res.render('addVote'));

// Add a gig
router.post('/addVote', (req, res) => {
    let {  memberId, circleId, numberofpeople,
        createdAt, date, endDate, where } = req.body;
      let errors = [];


  // Check for errors
  if (errors.length > 0) {
    res.render('addVote', {
      errors,
     memberId, numberofpeople, date, endDate
    });
  } else {


    // Make lowercase and remove space after comma
    //  technologies = technologies.toLowerCase().replace(/, /g, ',');

    // Insert into table
    Vote.create({
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