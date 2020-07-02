var InterestCategory = require("../models/InterestCategory");
var ImageEntity = require("../models/ImageEntity");
var Image = require("../models/Image");
var Global = require("../functions.js");
console.log("category_json_ctrl");

exports.delete = function (req, res) {
    console.log('deleted');
  };
  exports.getAll = function (req, res) {
    console.log('performing fetch all categories');

  
    var result = [];
    InterestCategory.findAll()
      .map(l => {
        return l;
      })
      .then(
        c => {
          res.contentType('application/json');
          res.json(c);
  
          console.log('result: ' + result + ' ');
        })
  
      .catch(err => console.log(err));
  };
  exports.addOne = function (req, res) {

    let { categoryName, image } = req.body;
    
    InterestCategory.findOne({ where: { id: req.body.id } }).then(function (categoryFound) {
      if (categoryFound == null)
      InterestCategory.create(
          {
            categoryName
          }).then(a => {
            if (filename!="")
            {
            ImageEntity.create({
              path: filename, entityId: a.id, entityType: "Category"}). then( a => {console.log("created file")});
            };
            if (req.body.image != null) {
                var filename = Global.createFile(image, req.body.theme + "-" + req.body.description, "categories");
                if (filename != null && filename != undefined) {
                  Global.createImageEntity("Category", filename, a.id);
                }
              }
            //here req.body.image
            /*
             if (filename!="")
             {
             ImageEntity.create({
               path: filename, entityId: a.id, entityType: "Circle"}). then( a => {console.log("created file")});
             };*/
  
            /*
                      if (req.body.image != null) {
                        var filename = Global.createFile(req.body.image, req.body.theme + "-" + req.body.description, "circles");
                        if (filename != null && filename != undefined) {
                          Global.createImageEntity("Circle", filename, a.id);
                        }
                      }*/
            console.log('success');
            res.json(a.id);
          })
          .catch(err => console.log(err));
    });
  };