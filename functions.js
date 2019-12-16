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