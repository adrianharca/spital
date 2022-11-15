const ImageEntity = require('./models/ImageEntity');
const Image = require('./models/Image');
var db = require("./config/db.js");
const fs = require('fs');
var host = "localhost";
var user = "adrianharca";
var parolaUser = "adr04har";
const uploadFolder = "public\\uploads";

const months = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie'
]


var Handlebars = require('handlebars');

Handlebars.registerHelper('convertdate', function (v1) {
    var dateS = new Date(v1);
    return dateS.getDate() + " " + months.at(dateS.getMonth()) + " " + dateS.getFullYear() + " " + dateS.getHours() + ":" + dateS.getMinutes();
});
Handlebars.registerHelper('ifNotNull', function (v1,options) {
     if (v1==null)
            return options.inverse(this);
     if (v1==undefined)
            return options.inverse(this);
     if (v1=="")
            return options.inverse(this);
     if (v1==" ")
            return options.inverse(this);
     else return options.fn(this);
});
Handlebars.registerHelper("pageincrement", function(page){
  // if(isNaN(page))
  // return 1;
  // else
  // if(!page)
  // return 0;
  // if(page+1<count/limit)
  return ++page;
  // return page;
});

  Handlebars.registerHelper("pagedecrement", function(page){
    // if(isNaN(page))
    // return 1;
    // else
    return --page;
});
Handlebars.registerHelper('transformvaluetophotolink', function (value) {
    var returnedValue = value;
    if (value==undefined)
        returnedValue = "";

    else if (value.trim().localeCompare('')==0)
        returnedValue = "";
    return returnedValue.replaceAll(" ","-");
});
Handlebars.registerHelper('transformvaluetostylevisibility', function (value) {
    var returnedValue = "visible";
    if (value==undefined)
        returnedValue = "hidden";
    else if (value.trim().localeCompare('')==0)
        returnedValue = "hidden";
    return returnedValue;
});
Handlebars.registerHelper('transformvaluetophoto', function (value) {
    var returnedValue = value;
    if (value==undefined)
        returnedValue = "";
     if (value=='')
        returnedValue = "";
    return returnedValue.replace("adaugafoto0","").replace("adaugafoto1","").replace("adaugafoto2","").replace("adaugafoto3","").replace("adaugafoto4","").replace("adaugafoto5","").replace("adaugafoto69","").replace("adaugafoto912","").replace("adaugafoto1224","").replace("adaugafoto2430","").replace("adaugafoto3036","");
});
Handlebars.registerHelper('transformvaluestochecked', function (value, role) {
    var returnedValue = "checked";
    if (value==undefined)
        returnedValue = "";
     if (value==0)
        returnedValue = "";
    console.log(value + " " + role);
    return returnedValue;
});
Handlebars.registerHelper('transformvaluetochecked', function (value) {
    var returnedValue = "checked";
    if (value==undefined)
        returnedValue = "";
     if (value==0)
        returnedValue = "";
    return returnedValue;
});
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
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
function test(filename) {
    console.log(uploadFolder + "\\" + filename);
    fs.unlinkSync(uploadFolder + "\\" + filename);
}
exports.deleteFile= function(name){
     console.log(name);
     let regex = new RegExp('^' + name);
     fs.readdirSync(uploadFolder)
        .filter(f => regex.test(f))
        .map(f => test(f))
}
exports.getUploadFolder=function() {
    return uploadFolder;
}
exports.createConnection = function(mysql){
    return mysql.createConnection({
        host: host,
        user: user,
        password: parolaUser
    });
}
exports.checkNull = function (value) {
    var returnedValue = "";
    if (value==undefined)
        return returnedValue;
    else if (value==null)
        return returnedValue;
    else
        return value;
}

exports.convertToCheckbox= function (value) {
    if (value==0)
        return "";
    else return value;
}

exports.transformCheckboxField=function (field) {
               if (field==undefined)
                return 0;
               if (field=="")
                return 0;

               else return 1;
        }
exports.convertLuna = function(luna) {

    return months.indexOf(luna);
}

exports.convertNumberToMonth = function(numberOfMonth) {
    return months.at(numberOfMonth);
}

function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() +
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
};

exports.calculateAge = function(zi, luna, an) {
    if (an==null)
        return "-";
    else {
        var birthdate = new Date(an, luna, zi);
        var month_diff = monthDiff(birthdate,new Date());
        var years = parseInt(month_diff / 12);
        var numberOfMonths = month_diff - (years * 12);
        return years + " ani, " + numberOfMonths + " luni";
    }
}

exports.appendToSQL = function(sql, alreadyFiltered, fieldName, value) {
 if (alreadyFiltered)
     sql = sql + " and " + fieldName + "='" + value + "'";
 else
     sql = sql + " where " + fieldName+ "='" + value + "'";
  return sql;
}
exports.getHost =function(){
   return host;
}
exports.getUser =function(){
   return user;
}
exports.getParola =function(){
   return parolaUser;
}
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
exports.Arsura = function (numeArsuraVar){

    this.numeArsura= numeArsuraVar;
    return this;
}

exports.limitRecords = function () {
        return 100;
}

exports.FisaTerapie = function (dataVar, idVar, idFoaieVar, idPacientVar){
    this.data= dataVar;
    this.idFisa = idVar;
    this.idFoaie = idFoaieVar;
    this.idPacient = idPacientVar;
    return this;
}

exports.Epicrisis = function (dataVar, idVar) {
    this.staregenerala = null;
    this.intubat = null;
    this.tranzitreluat = null;
    this.cantitatediureza = null;
    this.extremitati = null;
    this.mucoase = null;
    this.dataV = dataVar;
    this.idVary = idVar;
    return this;
};

exports.EpicrizaDeEtapa = function (dataVar){
    this.staregenerala = null;
    this.intubat = null;
    this.tranzitreluat = null;
    this.cantitatediureza = null;
    this.extremitati = null;
    this.mucoase = null;
    this.dataV = dataVar;
    this.idVary =null;
    return this;
};
exports.convertDa = function (value){
    var returned;
    if (value==undefined) return 0;
    else if (value==null) return 0;
    else if (value.trim().localeCompare("")==0) return 0;
    else if (value.trim().localeCompare("Nu")==0) return 0;
    else return 1;
}
exports.convertToDa = function (value){
    if (value==undefined) return "Nu";
    else if (value==null) return "Nu";
    else if (value.toString().trim().localeCompare("0")==0) return "Nu";
    else return "Da";
}
exports.EpicrizaDeEtapa = function (dataVar, stareGeneralaVar, intubatVar,tranzitreluatVar, cantitatediurezaVar, extremitatiVar, mucoaseVar, idVar){
    this.staregenerala = stareGeneralaVar;
    this.intubat = intubatVar;
    this.tranzitreluat = tranzitreluatVar;
    this.cantitatediureza = cantitatediurezaVar;
    this.extremitati = extremitatiVar;
    this.mucoase = mucoaseVar;
    this.dataV = dataVar;
    this.idVary = idVar;
    return this;
}


function doUpload(fileElementId) {
    let data = document.getElementById(fileElementId).files[0];
    let entry = document.getElementById(fileElementId).files[0];
    fetch('uploads/' + encodeURIComponent(entry.name), {method:'PUT',body:data});
    alert('your file has been uploaded');
    location.reload();
};

exports.Bio = function (dataVar){
    this.data= dataVar;
    return this;
}

exports.Evolutie = function(positionVar, dataVar, evolutieVar, tratamentVar){
    this.position = positionVar;
    this.dataEvolutiei = dataVar;
    this.evolutie = evolutieVar;
    this.tratament = tratamentVar;
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

exports.Sectie = function (positionVar, numeVar, saloaneVar) {
    this.position = positionVar;
    this.nume = numeVar;
    this.saloane = saloaneVar;
    return this;
}

exports.Arsura = function (positionVar) {
    this.position = positionVar;
    this.grad = null;
    this.localizare = null;
    this.procent = null;
    return this;
}

exports.Arsura = function (positionVar, gradVar, localizareVar, procentVar) {
    this.position = positionVar;
    this.grad = gradVar;
    this.localizare = localizareVar;
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