const ImageEntity = require('./models/ImageEntity');
const Image = require('./models/Image');
var db = require("./config/db.js");

var Handlebars = require('handlebars');


Handlebars.registerHelper("afisareSageata",function(analiz) {
                                            if (analiz.rezultat>analiz.maxLimit)
                                                return "➚";
                                            if (analiz.rezultat<analiz.minLimit)
                                                return  "➘";
                                              return "&nbsp;&nbsp;&nbsp;";
                                            });
Handlebars.registerHelper("afisareRezultat", function(analiz) {
if (analiz.rezultat>analiz.maxLimit)
    return analiz.rezultat + " ➚";
if (analiz.rezultat<analiz.minLimit)
    return analiz.rezultat + " ➘";
  return analiz.rezultat;
});

exports.isEmpty = function (obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }

  return true;
};
exports.getFooter = function(){
    footer = "Se declară că raportul de analize se referă numai la proba analizată.<br/>";
    footer += "Reproducerea sau utilizarea buletinului de analize în alte scopuri decât cele pentru care a fost realizat este strict interzisă!<br/>";
    footer += "Analizele marcate cu asterisc * nu sunt acoperite de acreditarea RENAR.<br/>";
    footer += "Opiniile și interpretările conținute în prezentul raport nu sunt acoperite de acreditarea RENAR.<br/>";
    footer += "Punctele de recoltare marcate cu diez # nu sunt acreditate RENAR.";
    return footer;
};
exports.createFilename = function (fileNameVar, folder){
  var mainPath = __dirname + "\\public\\img\\";
  var path = mainPath + folder;
  var shell = require('shelljs');
  var filename = "";
  const fs = require('fs');
    if (!fs.existsSync(path)) {
      shell.mkdir('-p', path);
    }
  if (fileNameVar.toString().indexOf(".jpg") > 0)
    filename = path + "\\" + fileNameVar;
  else
    filename = path + "\\" + fileNameVar + ".jpg";
  return filename;
}
exports.EpicrizaDeEtapa = function (dataVar){

    this.data= dataVar;
    return this;
}
exports.Bio = function (dataVar){

    this.data= dataVar;
    return this;
}
exports.Hemo = function (dataVar){
    this.data= dataVar;
    return this;
}
exports.Coagulare = function (dataVar){
    this.data= dataVar;
    return this;
}
exports.Recomandare = function (positionVar, recomandareVar) {
    this.position = positionVar;
    this.value = recomandareVar;
    return this;
}

exports.Arsura = function (positionVar) {
    this.position = positionVar;
    this.grad = null;
    this.localizare = null;
    this.vechime = null;
    this.procent = null;
    return this;
}
exports.Arsura = function (positionVar, gradVar, localizareVar, vechimeVar, procentVar) {
    this.position = positionVar;
    this.grad = gradVar;
    this.localizare = localizareVar;
    this.vechime = vechimeVar;
    this.procent = procentVar;
    return this;
}
exports.Analiza = function (tipAnalizaVar, rezultatVar, minLimitVar, maxLimitVar,intervalDeReferintaVar,comentariuVar) {
    this.tipAnaliza = tipAnalizaVar;
    this.rezultat = rezultatVar;
    this.minLimit = minLimitVar;
    this.maxLimit = maxLimitVar;
    this.intervalDeReferinta = intervalDeReferintaVar;
    this.comentariu = comentariuVar;
    return this;
};
exports.createFile = function (imageBody, fileNameVar, folder) {

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
    if (fileNameVar.toString().indexOf(".jpg") > 0)
      filename = path + "\\" + fileNameVar;
    else
      filename = path + "\\" + fileNameVar + ".jpg";
    fs.writeFile(filename, buffer, 'base64', function (err) { console.log(err); });
  }
  return filename;
};

function generateJoinQuery(queryType) {
  return "SELECT Distinct circles." + queryType + ".*,circles.image.path FROM circles." + queryType + " LEFT OUTER JOIN circles.imageentity on circles." + queryType + ".id = circles.imageentity.entityId and circles.imageentity.entityType='" + queryType + "'"

}
exports.getAllEntitiesWithImages = function (res, entityType) {

  db.sequelize.query(
    generateJoinQuery(entityType)
    , { type: db.sequelize.QueryTypes.SELECT }
  ).then(function (results) {
    if (results != null) {
      res.send(results);
    }
    else {
      res.send("No values found by getAll" + entityType + "s");
    }
  });
};


exports.createImageEntity = function (entityTypeVar, filenameVar, entityIdVar) {
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