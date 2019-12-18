const ImageEntity = require('./models/ImageEntity');
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
      console.log("filename: +" + filename);
      filename = path + "\\" +fileNameVar + ".jpg";
      fs.writeFile(filename, buffer, 'base64', function (err) { console.log(err); });
    }
      return filename;
  };

  function generateJoinQuery(queryType ){
    return "SELECT Distinct circles."+ queryType +".*,circles.imageentity.path FROM circles."+ queryType+ " LEFT OUTER JOIN circles.imageentity on circles."+ queryType +".id = circles.imageentity.entityId and circles.imageentity.entityType='"+ queryType + "'"

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
      ImageEntity.create({
        path: filenameVar, circleId: entityIdVar, entityType: entityTypeVar}). then( a => {console.log("created file for " +entityTypeVar.toString().toLower())});
  }