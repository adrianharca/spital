const ImageEntity = require('../models/ImageEntity');
const Image = require('../models/Image');
var Global = require("../functions.js");
console.log("image_json_ctrl");

exports.delete = function (req, res) {
  console.log('deleted');
}


function createImage(entityTypeVar, filenameVar, entityIdVar) {
  console.log("file name for image:" + filenameVar);
  images = Image.findOne({ where: { path: filenameVar } })
    .then(function (imageFound) {
      if (imageFound == null) {
        Image.create({ path: filenameVar }).then(bb => {
          if (bb != null) {
            console.log("created image " + JSON.stringify(bb));
            ImageEntity.create({
              imageId: bb.id, entityId: entityIdVar, entityType: entityTypeVar
            }).then(a => { console.log("created file for " + entityTypeVar.toString().toLowerCase()) + " with " + JSON.stringify(a) });
          };
        });

      }
    }
    );
  /*images = ImageEntity.findOne({ where: { id: entityIdVar, entityType: entityTypeVar } })
  .then(function (imageFound) {
    if (imageFound==null)
    ImageEntity.create({
      path: filenameVar, entityId: entityIdVar, entityType: entityTypeVar}). then( a => {console.log("created file for " +entityTypeVar.toString().toLowerCase())});
    }
  );*/
}
exports.updateImage = function (req, res) {
  images = ImageEntity.findOne({ where: { id: req.body.entityId, entityType: req.body.type } })
    .then(function (imageFound) {
      var filename = Global.createFile(req.body.image, req.body.filename, req.body.type + "s");
      if (imageFound == null) {

        if (filename != "") {

          Global.createImageEntity(req.body.type, filename, req.body.id);
          createImage(req.body.type, filename, req.body.id);
        }
        console.log('success');
        res.json(req.body.id);
      }
      else {
        if (filename != "") {
          console.log("updated");
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

exports.getAllMeetings = function (req, res) {
  Global.getAllEntitiesWithImages(res, "Meeting");

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
  console.log("add image:" + JSON.stringify(req.body.entityId) + " " + req.body.type + "; filename: " + req.body.filename);
  images = ImageEntity.findAll({ where: { id: req.body.entityId, entityType: req.body.type } })
    .then(function (imageFound) {
      console.log("details: " + req.body.entityId + " " + req.body.type);
      var filename = Global.createFile(req.body.image, req.body.filename, req.body.type + "s");

      console.log("created the file");
      if (imageFound == null || JSON.stringify(imageFound).length < 5) {
        if (filename != "") {
          //  Global.createImageEntity(req.body.type, filename, req.body.id);
          createImage(req.body.type, filename, req.body.entityId);
        }
      }
      else {
        console.log("we have found the file: " + JSON.stringify(imageFound));
      }
    });
  console.log('success');

  res.json(req.body.id);
}