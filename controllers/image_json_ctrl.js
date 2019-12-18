const ImageEntity = require('../models/ImageEntity');
var Global = require("../functions.js");
console.log("image_json_ctrl");

exports.delete= function(req,res){
    console.log('deleted');
  }

exports.updateImage =function(req,res){

}

exports.getAllUsers = function (req, res, entityType) {
  
  Global.getAllEntitiesWithImages(res,"User");
};

exports.getAllCircles = function (req, res) {
  Global.getAllEntitiesWithImages(res,"Circle");
   
}

exports.getAllMembers = function (req, res) {
  Global.getAllEntitiesWithImages(res,"Member");
  }

exports.getImages = function(req,res){

    ImageEntity.findAll()
        .then(
          c => {
        
          res.json({c});
        
          console.log('result: ' + c + ' ');
        })
      
        .catch(err => console.log(err));
  }
  exports.addImage = function(req, res){

    var filename = Global.createFile(req.body.image,req.body.path,req.body.entityType + "s");
      if (filename!=""){
        Global.createImageEntity(req.body.entityType,filename,req.body.id);
      }
      console.log('success');
      res.json(req.body.id);
  }