var InterestCategory = require('../models/InterestCategory');
var Interest = require("../models/Interest");
var Global = require("../functions.js");
var router = require('express').Router();
var multer = require('multer');



console.log("routes/interests.js");
router.get('/show',(req,res) => {
    InterestCategory.findAll()
    .then(c => {
      res.render('categories', { c });
      console.log('category name: ' + c.categoryName + ' ');
    })
    .catch(err => console.log(err));
});
router.get('/', (req, res) => {
    /*
    Interest.findAll()
      .then(c => {
        res.render('interests', { c });
        console.log('interest name: ' + c.interestName + ' ');
      })
      .catch(err => console.log(err));*/
    
    Interest.findAll({ include: [{
        model: InterestCategory,
        as: 'Categories',
        attributes: [['name','categoryName']]
      }]
    })
    .then( c => {
            if (c!=undefined)
            {
                /*
            c.forEach((resultSetItem) => {
                console.log("id: " + resultSetItem.id);
                Interest.findAll({where: {
                    categoryId: resultSetItem.id
                  }})
                  .then(c => {
                    res.render('interests', {categoryName: resultSetItem.categoryName, interestName: c.interestName});
                    console.log('interest name: ' + c.interestName + ' ');
                  })
                  .catch(err => console.log(err));
            });
            res.render('categories',  { c } );
            */
           res.render('interests', { c })
            }
     
      
    }).catch(err => {console.log(err);  res.render('errors',{error: err});});

    
  });




  // // Display add interest form
router.get('/add', (req, res) => res.render('addinterest'));

// Add an interest
router.post('/add', (req, res) => {
    let { interestName, categoryId } = req.body;
    let errors = [];
  
   // Check for errors
   if (interestName==null || interestName==""){
    errors.push({"text": "Please add a name for the interest"});
  }
  if (categoryId==null || categoryId==0 ){
    errors.push({"text": "Please add a category id"});
  }
    // Check for errors
    if (errors.length > 0) {
      res.render('addInterest', {
        errors,
        interestName, categoryId
      });
    } else {

        Interest.findOne({where: {
                                    interestName: interestName, categoryId: categoryId
                                    }
                             })
            .then( tt => {
                if (tt == undefined ){
                    console.log(tt);
                     // Insert into table
                     
                   
                     Interest.create({
                          interestName, categoryId
                            })
                            .then(a => {
                                console.log('success');
                             })
                             .catch(err => console.log(err));
                    res.render('addinterest');
                           
                }
                else{
                    console.log(tt);
                    res.render('errors',{error: 'The keyword already exists!'});
                }
                
        });
     
  
    }
  });




module.exports = router;
