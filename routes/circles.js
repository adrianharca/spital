const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Sequelize = require('sequelize');
const Circle = require('../models/Circle');

const Op = Sequelize.Op;


console.log("routes/circles.js")

//test data for insert
router.get('/demoadd', (req, res) => {
  const data = {
    theme: 'sex',
    description: 'have',
    initiatorid: '0',
  }
  let { theme, description, initiatorid } = data;
  Circle.create({
    theme, description, initiatorid
  }).then(a => {
    console.log('created cirlce ' + theme);
    res.redirect('/circles')
  })
    .catch(err => console.log(err));
})


// Get circle list
router.get('/', (req, res) => {

  Circle.findAll()
    .then(c => {
      res.render('circles', { c });
      console.log('theme: '+ c.theme + ' ');
    })
    .catch(err => console.log(err));
});

// // Display add gig form
router.get('/add', (req, res) => res.render('add'));

// Add a gig
router.post('/add', (req, res) => {
  let { theme, description, initiatorid} = req.body;
  let errors = [];

  // Validate Fields
  // if (!theme) {
  //   errors.push({ text: 'Please add a title' });
  // }
  // if (!description) {

  //   errors.push({ text: 'Please add a description' });
  // }
  // //   if(!contact_email) {
  // //     errors.push({ text: 'Please add a contact email' });
  // //   }

  // Check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      theme, description,  initiatorid });
  } else {
    

    // Make lowercase and remove space after comma
    //  technologies = technologies.toLowerCase().replace(/, /g, ',');

    // Insert into table
    Circle.create({
      theme, description,  initiatorid    })
      .then(a => { 
        console.log('success');
        res.redirect('/circles')})
      .catch(err => console.log(err));
     
  }
});

// // Search for gigs
// router.get('/search', (req, res) => {
//   let { term } = req.query;

//   // Make lowercase
//   term = term.toLowerCase();

//   Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
//     .then(gigs => res.render('gigs', { gigs }))
//     .catch(err => console.log(err));
// });

module.exports = router;