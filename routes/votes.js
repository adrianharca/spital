const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Vote = require('../models/Vote');
const When = require('../models/When');
const Where = require('../models/Where');

const Op = Sequelize.Op;

//Use this class for interface functions & put ur json api in controllers/vote_json_ctrl
console.log("routes/votes.js");
function renderVote(c) {
  var container = new Object();
  const fields = ['id', 'memberId', 'circleId', 'numberofpeople',
    //    'date', 'endDate',
    //    'placename', 'location', 'spotType',
    'createdAt', 'updatedAt', 'deletedAt']
  fields.forEach((item, k) => {
   // console.log(item, ' ', c[item]);
   //mai bine sa ramana comentat, pentru ca ocupa tot terminalul
    container[item] = c[item];
  });
  if (c.date != undefined) {
    container.when = new When(c);
  }
  if (c.location != null) {
    container.where = new whereMaker(c);
  }
}

// Get vote list
router.get('/', (req, res) => {

  Vote.findAll()
    .then(c => {
      res.render('votes', { c });

      console.log('displayed votes');
    })
    .catch(err => console.log(err));
});





// // Display add user form
router.get('/addVote', (req, res) => res.render('addVote'));

// Add a gig
router.post('/addVote', (req, res) => {
  let { memberId, circleId, numberofpeople,
    createdAt, date, endDate, where } = req.body;
  let errors = [];


  // Check for errors
  if (errors.length > 0) {
    res.render('addVote', {
      errors,
      memberId, numberofpeople, date, endDate, location
    });
  } else {
    // Insert into table
    Vote.create({
      memberId
    })
      .then(a => {
        console.log('success');
        res.redirect('/votes')
      })
      .catch(err => console.log(err));

  }
});


module.exports = router;