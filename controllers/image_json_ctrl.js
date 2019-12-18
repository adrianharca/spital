const ImageEntity = require('../models/ImageEntity');
const Sequelize = require('sequelize');
var Circle = require("../models/Circle");
var User = require("../models/User");
console.log("image_json_ctrl");

exports.delete= function(req,res){
    console.log('deleted');
  }
exports.updateImage =function(req,res){

}
exports.getAllUsers = function (req, res) {
  
  User.findAll({
    include: [{
      model: ImageEntity,
      attributes : ['path']
    }]
  }).then(function (userFound) {
    if (userFound!=null){
    res.send(userFound);
    }
else{
  res.send("no user found");
  }

})
};
exports.getAllCircles = function (req, res) {
  
  Circle.findAll({
    include: [{
      model: ImageEntity
    }]
  }).then(function (circleFound) {
    if (circleFound!=null){
    res.send(circleFound);
    }
else{
  res.send("no circle found");
  }

});
  /*
ImageEntity.findAll({
  include: [{
    model: Circle,
    required: false,
    attributes: ['id'],
    on: {
      id: Sequelize.col('imageentity.entityid'),
      entityType: "Circle"
    }
  }]
});*/
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
      if (req.body.entityType.equals("Circle")){
      ImageEntity.create({
        path: filename, circleId:req.body.entityid}). then( a => {console.log("created file for circle")});
      }
        else if (req.body.entityType.equals("User")){
          ImageEntity.create({
            path: filename, userId:req.body.entityid}). then( a => {console.log("created file for user")});
        }
        else if (req.body.entityType.equals("Member")){
          ImageEntity.create({
            path: filename, memberId:req.body.entityid}). then( a => {console.log("created file for member")});
        }
      console.log('success');
      res.json(a.id);
  }