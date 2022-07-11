const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const config = require('config');
const Sequelize = require('sequelize');
const User = require('../models/User');
var taskController = require("../controllers/circle_json_ctrl");
const Op = Sequelize.Op;

//Use this class for interface functions & put ur json api in controllers/users_json_ctrl
console.log("routes/users.js");
// router.route('/demoadd').get(taskController.demoadd);


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

  cetatenie = "Română";
res.render('adduser',{cetatenie});
});

// Add a gig
router.post('/adduser', (req, res) => {
  let { firstname, lastname, email } = req.body;
  let errors = [];

  // Check for errors
  if (errors.length > 0) {
    res.render('adduser', {
      errors,
      firstname, lastname, email,cetatenie
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