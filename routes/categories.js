var InterestCategory = require('../models/InterestCategory');
var router = require('express').Router();

console.log("routes/categories.js");

router.get('/', (req, res) => {

    InterestCategory.findAll()
      .then(c => {
        res.render('categories', { c });
        console.log('category name: ' + c.categoryName + ' ');
      })
      .catch(err => console.log(err));
  });


  // // Display add category form
router.get('/add', (req, res) => res.render('addcategory'));


router.post('/add', (req, res) => {
    let { categoryName /*, image*/} = req.body;
    let errors = [];

  
    // Check for errors
    if (errors.length > 0) {
      res.render('add', {
        errors,
        categoryName /*, image*/
      });
    } else {
  
      InterestCategory.create({
        categoryName
      })
        .then(a => {
          console.log('success');
          res.redirect('/categories')
        })
        .catch(err => console.log(err));
  
    }
  });
module.exports = router;
