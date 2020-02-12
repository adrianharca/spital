const ImageEntity = require('./models/ImageEntity');
const Image = require('./models/Image');
var db = require("./config/db.js");

exports.createFile = function (imageBody, fileNameVar, folder){
  
    //var mainPath = __dirname + "\\.." + "\\public\\img\\";
    var mainPath = __dirname + "\\public\\img\\";
    var path = mainPath + folder;
    var pathC = require("path");
    var shell = require('shelljs');
    var filename = "";
    if (imageBody != undefined) {
      const fs = require('fs');
      if (!fs.existsSync(path)) {
        shell.mkdir('-p', path);
      }
      var rawImg = imageBody;
      let buffer = Buffer.from(rawImg);
      console.log("filename: +" + fileNameVar);
      if (fileNameVar.toString().indexOf(".jpg")>0)
         filename = path + "\\" +fileNameVar;
      else
         filename = path + "\\" +fileNameVar + ".jpg";
      fs.writeFile(filename, buffer, 'base64', function (err) { console.log(err); });
    }
      return filename;
  };

  function generateJoinQuery(queryType ){
    return "SELECT Distinct meetings."+ queryType +".*,meetings.image.path FROM meetings."+ queryType+ " LEFT OUTER JOIN meetings.imageentity on meetings."+ queryType +".id = meetings.imageentity.entityId and meetings.imageentity.entityType='"+ queryType + "'"

  }
  exports.getAllEntitiesWithImages = function (res, entityType) {
  
    db.sequelize.query(
      generateJoinQuery(entityType)
    , { type: db.sequelize.QueryTypes.SELECT }
      ).then(function(results) {
        if (results!=null){
          res.send(results);
        }
        else{
          res.send("No values found by getAll" + entityType +"s");
        }
      });
  };

  
  exports.createImageEntity = function (entityTypeVar, filenameVar, entityIdVar){
    console.log("file name for image:" + filenameVar);
    images = Image.findOne({ where: { path: filenameVar} })
    .then(function (imageFound) {
      if (imageFound==null){
      Image.create({path: filenameVar}).then( bb=> {
        if (bb!=null){
        console.log("created image " + JSON.stringify(bb));
        ImageEntity.create({
          imageId: bb.id, entityId: entityIdVar, entityType: entityTypeVar}). then( a => {console.log("created file for " +entityTypeVar.toString().toLowerCase()) + " with " + JSON.stringify(a)});
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