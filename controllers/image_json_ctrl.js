const ImageEntity = require('../models/ImageEntity');
var Global = require("../functions.js");
console.log("image_json_ctrl");

exports.delete = function (req, res) {
  console.log('deleted');
}

exports.updateImage = function (req, res) {
  images = ImageEntity.findOne({ where: { id: req.body.entityId, entityType: req.body.type } })
    .then(function (imageFound) {
      var filename = Global.createFile(req.body.image, req.body.filename, req.body.type + "s");
      if (imageFound == null) {

        if (filename != "") {
          Global.createImageEntity(req.body.type, filename, req.body.id);
        }
        console.log('success');
        res.json(req.body.id);
      }
      else {
        if (filename != "") {
          ImageEntity.update(
            { path: filename },
            { where: { entityId: req.body.entityId, entityType: req.body.type } }
          )
        };
        console.log('success');
        res.json(req.body.id);
      }
    });
}

exports.getAllUsers = function (req, res, entityType) {

  Global.getAllEntitiesWithImages(res, "User");
};

exports.getAllCircles = function (req, res) {
  Global.getAllEntitiesWithImages(res, "Circle");

}

exports.getAllMembers = function (req, res) {
  Global.getAllEntitiesWithImages(res, "Member");
}

exports.getImages = function (req, res) {
  ImageEntity.findAll()
    .then(
      c => {

        res.json({ c });

        console.log('result: ' + c + ' ');
      })

    .catch(err => console.log(err));
}
exports.addImage = function (req, res) {
  console.log("add image:" + JSON.stringify(req.body.entityId) + " " + req.body.type);
  images = ImageEntity.findAll({ where: { id: req.body.entityId, entityType: req.body.type } })
    .then(function (imageFound) {
console.log("details: " + req.body.entityId + " " + req.body.type);
      var filename = Global.createFile(req.body.image, req.body.filename, req.body.type + "s");

      console.log("created the file");
      if (imageFound == null || imageFound.path==undefined){
        if (filename != "") {
          Global.createImageEntity(req.body.type, filename, req.body.entityId);
        }
      }
      else{
        console.log("we have found the file: "+ imageFound.path + " " + imageFound.entityId + " " + imageFound.entityType);
      }
    });
  console.log('success');

  res.json(req.body.id);
}