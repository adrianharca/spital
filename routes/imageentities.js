var ImageEntity = require('../models/ImageEntity');
var router = require('express').Router();

const db = require('../config/db');
const Sequelize = require('sequelize');

console.log("routes/imageentities.js");
const Op = Sequelize.Op;
router.get('/', (req, res) => {

  ImageEntity.findAll()
      .then(c => {
        res.render('images', { c });
        console.log('path: ' + c.path + ' ');
      })
      .catch(err => console.log(err));
  });

  module.exports = router;