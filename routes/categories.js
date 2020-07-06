var InterestCategory = require('../models/InterestCategory');
var ImageEntity = require("../models/ImageEntity");
var Image = require("../models/Image");
var Global = require("../functions.js");
var router = require('express').Router();
var multer = require('multer');



console.log("routes/categories.js");

router.get('/', (req, res) => {

    InterestCategory.findAll()
      .then(c => {
        res.render('categories', { c });
        console.log('category name: ' + c.categoryName + ' ');
      })
      .catch(err => console.log(err));
  });



  router.get('/withImages', (req, res) => {

    InterestCategory.findAll( {
      include: [{
        model: Image
      }]
    })
    
      .then(c => {
        res.render('categories', { c });
       
      })
      .catch(err => console.log(err));
  });

  // // Display add category form
router.get('/add', (req, res) => res.render('addcategory'));

// Upload setup
//var upload =multer({ dest: "public/img/categories/" });

var storage = multer.diskStorage(
  {
      destination:  "public/img/categories/",
      filename: function ( req, file, cb ) {
          //req.body is empty... here is where req.body.new_file_name doesn't exists
          cb( null, req.body.categoryName + ".jpg" );
      }
  }
);
var upload = multer( { storage: storage } );
router.post('/add',upload.single('imageaa'), (req, res, next) => {
 
  let { categoryName , image } = req.body;
   let errors = [];

 

 
 
   // Check for errors
   if (categoryName==null || categoryName==""){
     errors.push({"text": "Please add a name for the category"});
   }
   if (image==""){
     errors.push({"text": "Please add an image"});
   }
   if (errors.length > 0) {
     res.render('addcategory', {
       errors,
       categoryName /*, image*/
     });
   } else {

InterestCategory.findOne({ where: { categoryName: req.body.categoryName } }).then(function (categoryFound) {
  if (categoryFound == null)
  {
  InterestCategory.create(
      {
        categoryName
      }).then(a => {
        
      //  Global.createImageEntity("Category", filename, a.id);
       
          var fileName = req.body.categoryName + ".jpg";
          Image.create({ path: fileName}).then( b => {
            ImageEntity.create({
              entityId: a.id, entityType: "Category", imageId: b.id}). then( a => {console.log("created file");
              console.log('had success:' + categeoryFound + "-" + JSON.stringify(req.body));
              console.log('success');
               res.redirect('/categories');
            });
              
          })
       
      
       
        
      })
      .catch(err => {
        console.log(JSON.stringify(err));
       errors.push({"text": "Aaa"});
       res.render('addcategory', {
         errors,
         categoryName 
       });
        //console.log(err)
       });
    }
   else{
     errors.push({"text": "The category was already created. Please choose a different category."});
     res.render('addcategory', {
       errors,
       categoryName 
     });
   }
});

   }
  
  });
module.exports = router;
