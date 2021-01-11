var InterestCategory = require("../models/InterestCategory");
var ImageEntity = require("../models/ImageEntity");
var Image = require("../models/Image");


var Global = require("../functions.js");
console.log("category_json_ctrl");

exports.getImageById = function (req, res) {
  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "circles";
  var pathC = require("path");
  var shell = require('shelljs');
  images = ImageEntity.findOne({ where: { entityId: idS, entityType: "Category" } }).then(function (imageFound) {
    if (imageFound != null) {
      Image.findOne({ where: { id: imageFound.imageId } }).then(function (imageEntityFound) {
        if (imageEntityFound != null)
          res.sendFile(pathC.resolve(imageEntityFound.path));
        else
          res.send("null");
      });

    }
    else {
      res.send("null");
    }
  }).error(function (err) {
    console.log("Error:" + "no image found");
    res.send(err);
  });
};


exports.delete = function (req, res) {
    console.log('deleted');
  };


  exports.getAll = function (req, res) {
    console.log('performing fetch all categories');

  
    var result = [];
    InterestCategory.findAll({
    
      order: [
          ['categoryName', 'ASC'],
      ]
  })
      .map(l => {
        return l;
      })
      .then(
        c => {
          if (Global.isEmpty(c))
          {
           // res.contentType('application/json');
            res.json(JSON.parse("[{\n\"id\": 1,\"categoryName\": \"Cinematography\",\n\"imageId\": null,\n\"createdAt\": \"2020-09-18 10:37:24\",\n\"updatedAt\": \"2020-09-18 10:37:24\",\n\"deletedAt\": null\n}]"));
          }
          {
            res.contentType('application/json');
            res.json(c);
            console.log('result: ' + result + ' ');
          }
        })
  
      .catch(err => console.log(err));
  };
 

   exports.addOne = function (req, res) {
 
    let { categoryName, image } = req.body;
    InterestCategory.findOne({ where: { categoryName: req.body.categoryName } }).then(function (categoryFound) {
      if (categoryFound == null)
      {
      InterestCategory.create(
          {
            categoryName
          }).then(a => {
            if (image!="")
            {
            ImageEntity.create({
              path: filename, entityId: a.id, entityType: "Category"}). then( a => {console.log("created file")});
            };
            if (image != null) {
                var filename = Global.createFile(image, req.body.theme + "-" + req.body.description, "categories");
                if (filename != null && filename != undefined) {
                  Global.createImageEntity("Category", filename, a.id);
                }
              }
            console.log('had success:' + categeoryFound + "-" + JSON.stringify(req.body));
            res.json(a.id);
          })
          .catch(err => console.log(err));
        }
       // else
       // res.json('The category was already created');
    });
  };
  