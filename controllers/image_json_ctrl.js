const ImageEntity = require('../models/ImageEntity');
const Sequelize = require('sequelize');
var Circle = require("../models/Circle");
console.log("image_json_ctrl");

exports.delete= function(req,res){
    console.log('deleted');
  }
exports.updateImage =function(req,res){

}

exports.getAllCircles = function (req, res) {
ImageEntity.findAll({
  include: [{
    model: Circle,
    required: false,
    on: {
      id: Sequelize.col('imageentity.entityid'),
      entityType: "Circle"
    }
  }]
});
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

    var filename = createFile(req.body.image,req.body.path,req.body.entityType + "s");
      if (filename!="")
      ImageEntity.create({
        path: filename, entityid:req.body.entityid, entityType: req.body.entityType}). then( a => {console.log("created file")});
      console.log('success');
      res.json(a.id);
  }