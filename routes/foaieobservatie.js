const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');
const url = require('url');
const fs = require('fs');
var formidable  = require('formidable');
const path = require('path');
var mysql = require('mysql');

var idfoaie=null;
var pacientId=null;
const isFileValid = (file) => {
  try {
  const type = file.mimetype.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "gif","tiff","bmp","svg", "apng","avif","webp","x-icon","svg+xml"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
  }
  catch(e) {
    return true;
  }
};

async function uploadFile(fileVar, newNameOfFile) {

  const file = fileVar;
  const uploadFolder  = "..\\public\\uploads";
  // checks if the file is valid
  const isValid = isFileValid(file);

  // creates a valid name by removing spaces
  const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));

  if (!isValid) {
    // throes error if file isn't valid
    console.log("File is not valid");
  }
  try {
    fs.renameSync(file.filepath, path.join(__dirname, uploadFolder, newNameOfFile + fileName));
  } catch (error) {
    console.log(error);
  }

}

function checkFile (fileVar, newNameOfFile) {
 if (fileVar.size!=0) {
            uploadFile (fileVar, newNameOfFile);
          }
}

function insertOrUpdateInDB(req, fields, files){
 let errors = [];
    try {

            let {medic, sectia,diagprincipal,diaginternare,diag24h,diag72h,intoxicatii,alergii,sange,rh,
                              insotit,vechimearsuri,diagexternare,datadeces,cauzadirectadeces,
                              cauzaantecedentadeces,starimorbideinitiale,starimorbideimportante,
                              prezentaparinti,descriere,locajutor,tratamentajutor,unitatiintermediare,
                              tratamentanterior,transport,tratasport,starepacient,timp,
                              epicrizafinala,medicatie,kineto,recomments,
                              cantitatelichide,cantlichide8h,cantlichide16h,cantlichide24h,dinamicaplagi,
                              cura,caiResp,adaugafoto0,
                              descriere1,analize1,adaugafoto1,spital1,online1,
                              descriere2,analize2,adaugafoto2,spital2,online2,
                              descriere3,analize3,adaugafoto3,spital3,online3,
                              descriere4,analize4,adaugafoto4,spital4,online4,
                              descriere5,analize5,adaugafoto5,spital5,online5,
                              descriere69,analize69,adaugafoto69,spital69,online69,
                              descriere912,analize912,adaugafoto912,spital912,online912,
                              descriere1218,analize1218,adaugafoto1218,spital1218,online1218,
                              descriere1824,analize1824,adaugafoto1824,spital1824,online1824,
                              descriere2430,analize2430,adaugafoto2430,spital2430,online2430,
                              descriere3036,analize3036,adaugafoto3036,spital3036,online3036} = fields;


            var indexArsura = 0;
            var arsuri = [];
            while (fields["gradSelect"+indexArsura]!=undefined){
                  arsuri.push(new Global.Arsura(indexArsura, fields["gradSelect"+indexArsura], fields["localizare"+indexArsura], fields["procent"+indexArsura]));
                  indexArsura++;
            }
            var indexEvolutii = 0;
            var evolutii = [];
            while (fields["evoldata"+indexEvolutii]!=undefined){
                              evolutii.push(new Global.Evolutie(indexEvolutii,fields["evoldata"+indexEvolutii],fields["evol"+indexEvolutii],fields["trat"+indexEvolutii]));
                              indexEvolutii++;
            }
            if (errors.length==0) {



            var con = mysql.createConnection({
                        host: Global.getHost(),
                        user: Global.getUser(),
                        password: Global.getParola(),
                        port: 3306
                        });
                  con.connect(function(err) {
                  if (err) throw err;

                  });
                  if (idfoaie==undefined)
                    idfoaie = -1;
                  var select = "SELECT * FROM spital.foaie_observatie where idfoaie_observatie=" + idfoaie;
                  con.query(select, (error, results, fields) => {
                      if (error) {
                                  return console.error(error.message);
                      }
                      sizeOfSelect = results.length;
                      var con = mysql.createConnection({
                                            host: Global.getHost(),
                                            user: Global.getUser(),
                                            password: Global.getParola()
                      });
                      con.connect(function(err) {
                                          if (err) throw err;

                      });
                      if (sizeOfSelect==0) {
                                 var sql = "INSERT INTO spital.foaie_observatie ( idpacient,medic, sectia, diagnosticprincipal,"
                               +"diagnosticlainternare, diag24h, diag72h, intoxicatii, alergii, sange, rh, insotit, vechimearsuri," +
                                "diagnosticexternare,datadeces, cauzadirectadeces, cauzaantecedentadeces, starimorbideinitiale, starimorbideimportante,prezentaparinti,descriere,locprimajutor,"+
                               "tratamentprimajutor,unitatiintermediare,tratamentanterior,transport,tratasport,stare,timp, epicrizafinala,medicatie,kineto, comments,"+
                               "cantitatelichide, cantlichide8h, cantlichide16h, cantlichide24h, dinamicaplagi, cura, caiResp,"+
                               "descriere1,analize1,spital1,online1,"+
                               "descriere2,analize2,spital2,online2,"+
                               "descriere3,analize3,spital3,online3,"+
                               "descriere4,analize4,spital4,online4,"+
                               "descriere5,analize5,spital5,online5,"+
                               "descriere69,analize69,spital69,online69,"+
                               "descriere912,analize912,spital912,online912,"+
                               "descriere1218,analize1218,spital1218,online1218,"+
                               "descriere1824,analize1824,spital1824,online1824,"+
                               "descriere2430,analize2430,spital2430,online2430,"+
                               "descriere3036,analize3036,spital3036,online3036, arsuri, evolutii) VALUES ?";
                                                                   var values = [
                                                                   [pacientId, medic, sectia, diagprincipal,diaginternare,diag24h,diag72h,intoxicatii,alergii,sange,rh,
                                                                                                  insotit,vechimearsuri,diagexternare,datadeces,cauzadirectadeces,
                                                                                                  cauzaantecedentadeces,starimorbideinitiale,starimorbideimportante,
                                                                                                  Global.transformCheckboxField(prezentaparinti),descriere,locajutor,tratamentajutor,unitatiintermediare,
                                                                                                  tratamentanterior,transport,tratasport,starepacient,timp,
                                                                                                  epicrizafinala,medicatie,kineto,recomments,
                                                                                                  cantitatelichide,cantlichide8h,cantlichide16h,cantlichide24h,dinamicaplagi,
                                                                                                  cura,Global.transformCheckboxField(caiResp),
                                                                                                  descriere1,analize1,Global.transformCheckboxField(spital1),Global.transformCheckboxField(online1),
                                                                                                  descriere2,analize2,Global.transformCheckboxField(spital2),Global.transformCheckboxField(online2),
                                                                                                  descriere3,analize3,Global.transformCheckboxField(spital3),Global.transformCheckboxField(online3),
                                                                                                  descriere4,analize4,Global.transformCheckboxField(spital4),Global.transformCheckboxField(online4),
                                                                                                  descriere5,analize5,Global.transformCheckboxField(spital5),Global.transformCheckboxField(online5),
                                                                                                  descriere69,analize69,Global.transformCheckboxField(spital69),Global.transformCheckboxField(online69),
                                                                                                  descriere912,analize912,Global.transformCheckboxField(spital912),Global.transformCheckboxField(online912),
                                                                                                  descriere1218,analize1218,Global.transformCheckboxField(spital1218),Global.transformCheckboxField(online1218),
                                                                                                  descriere1824,analize1824,Global.transformCheckboxField(spital1824),Global.transformCheckboxField(online1824),
                                                                                                  descriere2430,analize2430,Global.transformCheckboxField(spital2430),Global.transformCheckboxField(online2430),
                                                                                                  descriere3036,analize3036,Global.transformCheckboxField(spital3036),Global.transformCheckboxField(online3036),JSON.stringify(arsuri),JSON.stringify(evolutii)]
                                                                   ];
                                                                   con.query(sql, [values], function (err, result) {
                                                                   if (err) throw err;

                                                                     var tempId = result.insertId;
                                                                     console.log(tempId);
                                                                     var sqlPhotos = "update spital.foaie_observatie set adaugafoto0='"+ fileNameForField(files.adaugafoto0, idfoaie+"adaugafoto0")+ "', " +
                                                                     "adaugafoto1 ='" + fileNameForField(files.adaugafoto1, idfoaie+"adaugafoto1") + "', "
                                                                     "adaugafoto2 ='" + fileNameForField(files.adaugafoto2, idfoaie+"adaugafoto2") + "', "
                                                                     "adaugafoto3 ='" + fileNameForField(files.adaugafoto3, idfoaie+"adaugafoto3") + "', "
                                                                     "adaugafoto4 ='" + fileNameForField(files.adaugafoto4, idfoaie+"adaugafoto4") + "', "
                                                                     "adaugafoto5 ='" + fileNameForField(files.adaugafoto5, idfoaie+"adaugafoto5") + "', "
                                                                     "adaugafoto69 ='" + fileNameForField(files.adaugafoto69, idfoaie+"adaugafoto69") + "', "
                                                                     "adaugafoto912 ='" + fileNameForField(files.adaugafoto912, idfoaie+"adaugafoto912") + "', "
                                                                     "adaugafoto1218 ='" + fileNameForField(files.adaugafoto1218, idfoaie+"adaugafoto1218") + "', "
                                                                     "adaugafoto1824 ='" + fileNameForField(files.adaugafoto1824, idfoaie+"adaugafoto1824") + "', "
                                                                     "adaugafoto2430 ='" + fileNameForField(files.adaugafoto2430, idfoaie+"adaugafoto2430") + "', "
                                                                     "adaugafoto3036 ='" + fileNameForField(files.adaugafoto3036, idfoaie+"adaugafoto3036") + "' "
                                                                     " where idfoaie_observatie="+tempId;
                                                                     con.query(sql, [values], function (err, result) {
                                                                                    if (err) throw err;
                                                                                    con.end();
                                                                              });
                                                                      //res.redirect("/foaie_observatie/allFiles");
                                                                   });
                              }
                              else {
                                            var sql = "Update spital.foaie_observatie set medic='" + medic +"', sectia='"+ sectia + "', diagnosticprincipal='"+diagprincipal+"',"+
                                            "diagnosticlainternare='" +diaginternare + "', diag24h='"+diag24h + "', diag72h='"+diag72h+"', intoxicatii='"+ intoxicatii+ "'," +
                                            "alergii='"+ alergii + "', sange='"+ sange + "', rh='"+ rh + "', insotit='"+ insotit + "', vechimearsuri='"+vechimearsuri + "'," +
                                            "diagnosticexternare='"+ diagexternare + "',datadeces='"+ datadeces+ "', cauzadirectadeces='"+ cauzadirectadeces+ "', cauzaantecedentadeces='"+ cauzaantecedentadeces+ "', starimorbideinitiale='"+starimorbideinitiale + "', starimorbideimportante='"+ starimorbideimportante + "',prezentaparinti='"+ Global.transformCheckboxField(prezentaparinti)+ "',descriere='"+ descriere + "',locprimajutor='"+ locajutor+ "',"+
                                            "tratamentprimajutor='"+ tratamentajutor+ "',unitatiintermediare='"+ unitatiintermediare+ "',tratamentanterior='"+ tratamentanterior+ "',transport='"+ transport+ "',tratasport='"+ tratasport+ "',stare='"+ starepacient+ "',timp='"+ timp+ "', epicrizafinala='"+ epicrizafinala+ "',medicatie='"+ medicatie+ "',kineto='"+ kineto+ "', comments='"+ recomments+ "',"+
                                            "cantitatelichide='"+ cantitatelichide+ "', cantlichide8h='"+ cantlichide8h+ "', cantlichide16h='"+ cantlichide16h+ "', cantlichide24h='"+ cantlichide24h+ "', dinamicaplagi='"+ dinamicaplagi+ "', cura='"+ cura+ "', caiResp='"+ Global.transformCheckboxField(caiResp)+ "',"+
                                            "descriere1='"+ descriere1 + "',analize1='"+ analize1+ "',adaugafoto1='"+ fileNameForField(files.adaugafoto1, idfoaie+"adaugafoto1") + "',spital1='"+ Global.transformCheckboxField(spital1) + "',online1='"+ Global.transformCheckboxField(online1) + "',"+
                                            "descriere2='"+ descriere2 + "',analize2='"+ analize2+ "',adaugafoto2='"+ fileNameForField(files.adaugafoto2, idfoaie+"adaugafoto2") + "',spital2='"+ Global.transformCheckboxField(spital2) + "',online2='"+ Global.transformCheckboxField(online2) + "',"+
                                            "descriere3='"+ descriere3 + "',analize3='"+ analize3 + "',adaugafoto3='"+ fileNameForField(files.adaugafoto3, idfoaie+"adaugafoto3") + "',spital3='"+ Global.transformCheckboxField(spital3) + "',online3='"+ Global.transformCheckboxField(online3) + "',"+
                                            "descriere4='"+ descriere4 + "',analize4='"+ analize4 + "',adaugafoto4='"+ fileNameForField(files.adaugafoto4, idfoaie+"adaugafoto4") + "',spital4='"+ Global.transformCheckboxField(spital4) + "',online4='"+ Global.transformCheckboxField(online4) + "',"+
                                            "descriere5='"+ descriere5 + "',analize5='"+ analize5 + "',adaugafoto5='"+ fileNameForField(files.adaugafoto5, idfoaie+"adaugafoto5") + "',spital5='"+ Global.transformCheckboxField(spital5) + "',online5='"+ Global.transformCheckboxField(online5) + "',"+
                                            "descriere69='"+ descriere69 + "',analize69='"+ analize69 + "',adaugafoto69='"+ fileNameForField(files.adaugafoto69, idfoaie+"adaugafoto69") + "',spital69='"+ Global.transformCheckboxField(spital69) + "',online69='"+ Global.transformCheckboxField(online69) + "',"+
                                            "descriere912='"+ descriere912 + "',analize912='"+ analize912 + "',adaugafoto912='"+ fileNameForField(files.adaugafoto912, idfoaie+"adaugafoto912") + "',spital912='"+ Global.transformCheckboxField(spital912) + "',online912='"+ Global.transformCheckboxField(online912) + "',"+
                                            "descriere1218='"+ descriere1218 + "',analize1218='"+ analize1218 + "',adaugafoto1218='"+ fileNameForField(files.adaugafoto1218, idfoaie+"adaugafoto1218") + "',spital1218='"+ Global.transformCheckboxField(spital1218) + "',online1218='"+ Global.transformCheckboxField(online1218) + "',"+
                                            "descriere1824='"+ descriere1824+ "',analize1824='"+ analize1824 + "',adaugafoto1824='"+ fileNameForField(files.adaugafoto1824, idfoaie+"adaugafoto1824") + "',spital1824='"+ Global.transformCheckboxField(spital1824) + "',online1824='"+ Global.transformCheckboxField(online1824) + "',"+
                                            "descriere2430='"+ descriere2430+ "',analize2430='"+ analize2430 + "',adaugafoto2430='"+ fileNameForField(files.adaugafoto2430, idfoaie+"adaugafoto2430") + "',spital2430='"+ Global.transformCheckboxField(spital2430) + "',online2430='"+ Global.transformCheckboxField(online2430) + "',"+
                                            "descriere3036='"+ descriere3036+ "',analize3036='"+ analize3036 + "',adaugafoto3036='"+ fileNameForField(files.adaugafoto3036, idfoaie+"adaugafoto3036") + "',spital3036='"+ Global.transformCheckboxField(spital3036) + "',online3036='"+ Global.transformCheckboxField(online3036) + "', arsuri='"+ JSON.stringify(arsuri) +"', evolutii='" + JSON.stringify(evolutii) + "', adaugafoto0='"+ fileNameForField(files.adaugafoto0, idfoaie+"adaugafoto0") + "' where idfoaie_observatie="+idfoaie;

                                            con.query(sql, function (err, result) {
                                                        if (err) throw err;
                                                        con.end();
                                                        //res.redirect("/foaie_observatie/allFiles");
                                            });

                              }
                      });
                      }
                        else {
                        /*res.render('foaie_observatie', {
                                                          errors,
                                                          foaie
                                                        });
                        */
                        }
        }
     catch(e){
        errors.push ({"text": e});
        console.log(e);
        /*
        res.render('foaie_observatie', {
          errors,foaie
        });
        */
      }

}
function fileNameForField(field, fieldName){
    if (field.size!=0)
        return fieldName + field.originalFilename;
    else
        return "";
}
router.post('/', (req, res) => {
    var formData = new formidable.IncomingForm();
    const query = url.parse(req.url, true).query;
    if (req.body.medic=="") {
         errors.push ({"text": "Numele medicului trebuie să fie precizat."});
    }

    if (req.body.sectia=="") {
         errors.push ({"text": "Numele secției trebuie să fie precizat."});
    }
    const data = query.data;
    pacientId = query.pacient;
    idfoaie = query.foaie;


    //+ "." + file.originalFilename.split('.').pop()
    formData.parse(req, async (err, fields, files) => {

    insertOrUpdateInDB(req, fields, files);
    checkFile (files.adaugafoto0, idfoaie+ "adaugafoto0");
    checkFile (files.adaugafoto1, idfoaie+ "adaugafoto1");
    checkFile (files.adaugafoto2, idfoaie+  "adaugafoto2");
    checkFile (files.adaugafoto3,idfoaie+  "adaugafoto3");
    checkFile (files.adaugafoto4, idfoaie+  "adaugafoto4");
    checkFile (files.adaugafoto5, idfoaie+  "adaugafoto5");
    checkFile (files.adaugafoto69, idfoaie+ "adaugafoto69");
    checkFile (files.adaugafoto912, idfoaie+  "adaugafoto912");
    checkFile (files.adaugafoto1218,idfoaie+  "adaugafoto1218");
    checkFile (files.adaugafoto1824, idfoaie+ "adaugafoto1824");
    checkFile (files.adaugafoto2430,idfoaie+  "adaugafoto2430");
    checkFile (files.adaugafoto3036,idfoaie+  "adaugafoto3036");
    if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
    }
    else {
        res.redirect(301,'/foaie_observatie/allFiles');
    }
    });

});
router.get('/allFiles', (req, res) => {
    var selectAllFiles = "select idfoaie_observatie,pacient.idpacient, numefamilie, prenume, foaie_observatie.medic, foaie_observatie.sectia, foaie_observatie.CURRENT_TIMESTAMP as timeCol from spital.foaie_observatie inner join spital.pacient on pacient.idpacient=foaie_observatie.idpacient order by idfoaie_observatie limit 100";
    const query = url.parse(req.url, true).query;
    var page = query.page;
    if (page!=null) {
        selectAllFiles = selectAllFiles + " offset " + page*100;
    }

var con = mysql.createConnection({
        host: Global.getHost(),
        user: Global.getUser(),
        password: Global.getParola()
      });
  con.connect(function(err) {
    if (err) throw err;
    con.query(selectAllFiles, function (err, result, fields) {
      if (err) throw err;
      res.render('foi', result  );
      con.end();
    });
    });
});
router.get('/', (req, res) => {
        const query = url.parse(req.url, true).query;
        const data = query.data;
        pacientId = query.pacient;
        idfoaie = query.foaie;
        etichete = {};
        foaie = {};
        foaie.evolutiiList = [];
        foaie.arsuri = [];
        foaie.anamneza = {};
        foaie.detaliipacient = {};
        foaie.buletinebio = [];
        foaie.buletinehemo = [];
        foaie.buletinecoagulare = [];
        foaie.epicrizedeetapa = [];
        foaie.fiseterapie= [];

        if (pacientId!=null)
            {
                 var con = mysql.createConnection({
                            host: Global.getHost(),
                            user: Global.getUser(),
                            password: Global.getParola(),
                            port: 3306
                            });
                      con.connect(function(err) {
                      if (err) throw err;

                      });
                      var select = "SELECT prenume, numefamilie, zi, luna, an, sex, cnp, cod FROM spital.pacient where idpacient=" + pacientId;
                      con.query(select, (error, results, fields) => {
                                if (error) {
                                            return console.error(error.message);
                                }

                                foaie.detaliipacient.nume  =results[0].numefamilie + " " + results[0].prenume;

                                foaie.detaliipacient.varsta = Global.calculateAge(results[0].zi,results[0].luna, results[0].an);
                                foaie.detaliipacient.sex = results[0].sex;
                                foaie.detaliipacient.cnp = results[0].cnp;
                                foaie.detaliipacient.cod = results[0].cod;

                                if (idfoaie!=null) {
                                    var selectFoaieObservatie = "SELECT * FROM spital.foaie_observatie where idfoaie_observatie=" + idfoaie;
                                    con.query(selectFoaieObservatie, (error, results, fields) => {
                                                                    if (error) {
                                                                                return console.error(error.message);
                                                                    }
                                    foaie.medic =  results[0].medic;

                                    foaie.sectia = results[0].sectia;
                                    foaie.epicrizafinala = results[0].epicrizafinala;
                                    foaie.cura = results[0].cura;
                                    foaie.caiResp = results[0].caiResp;
                                    foaie.anamneza.loc = results[0].loc;
                                    foaie.anamneza.descriere = results[0].descriere;
                                    foaie.anamneza.prezentaparinti = results[0].prezentaparinti;
                                    foaie.anamneza.locprimajutor = results[0].locprimajutor;
                                    foaie.anamneza.tratamentprimajutor = results[0].tratamentprimajutor;
                                    foaie.anamneza.transport = results[0].transport;
                                    foaie.anamneza.timp = results[0].timp;
                                    foaie.anamneza.stare = results[0].stare;
                                    foaie.anamneza.tratasport = results[0].tratasport;
                                    foaie.rh = results[0].rh;
                                    foaie.sange = results[0].sange;
                                    foaie.alergii = results[0].alergii;
                                    foaie.intoxicatii = results[0].intoxicatii;
                                    foaie.diag72h = results[0].diag72h;
                                    foaie.diag24h = results[0].diag24h;
                                    foaie.diagnosticprincipal = results[0].diagnosticprincipal;
                                    foaie.diagnosticlainternare = results[0].diagnosticlainternare;
                                    foaie.insotit = results[0].insotit;
                                    foaie.vechimearsuri = results[0].vechimearsuri;
                                    foaie.diagnosticexternare = results[0].diagnosticexternare;
                                    foaie.datadeces = results[0].datadeces;
                                    foaie.cauzadirectadeces = results[0].cauzadirectadeces;
                                    foaie.cauzaantecedentadeces = results[0].cauzaantecedentadeces;
                                    foaie.starimorbideinitiale = results[0].starimorbideinitiale;
                                    foaie.starimorbideimportante = results[0].starimorbideimportante;
                                    foaie.anamneza.unitatiintermediare = results[0].unitatiintermediare;
                                    foaie.anamneza.tratamentanterior = results[0].tratamentanterior;
                                    foaie.anamneza.cantitatelichide = results[0].cantitatelichide;
                                    foaie.anamneza.cantlichide8h = results[0].cantlichide8h;
                                    foaie.anamneza.cantlichide16h = results[0].cantlichide16h;
                                    foaie.anamneza.cantlichide24h = results[0].cantlichide24h;
                                    foaie.anamneza.dinamicaplagi = results[0].dinamicaplagi;
                                    foaie.epicrizafinala = results[0].epicrizafinala;
                                    foaie.medicatie = results[0].epicrizafinala;
                                    foaie.kineto = results[0].epicrizafinala;
                                    foaie.comments = results[0].comments;
                                    foaie.descriere1 = results[0].descriere1;
                                    foaie.analize1 = results[0].analize1;
                                    foaie.spital1 = results[0].spital1;
                                    foaie.online1 = results[0].online1;
                                    foaie.adaugafoto1 = results[0].adaugafoto1;
                                    foaie.descriere2 = results[0].descriere2;
                                    foaie.analize2 = results[0].analize2;
                                    foaie.spital2 = results[0].spital2;
                                    foaie.online2 = results[0].online2;
                                    foaie.adaugafoto2 = results[0].adaugafoto2;
                                    foaie.descriere3 = results[0].descriere3;
                                    foaie.analize3 = results[0].analize3;
                                    foaie.spital3 = results[0].spital3;
                                    foaie.online3 = results[0].online3;
                                    foaie.adaugafoto3 = results[0].adaugafoto3;
                                    foaie.descriere4 = results[0].descriere4;
                                    foaie.analize4 = results[0].analize4;
                                    foaie.spital4 = results[0].spital4;
                                    foaie.online4 = results[0].online4;
                                    foaie.adaugafoto4 = results[0].adaugafoto4;
                                    foaie.descriere5 = results[0].descriere5;
                                    foaie.analize5 = results[0].analize5;
                                    foaie.spital5 = results[0].spital5;
                                    foaie.online5 = results[0].online5;
                                    foaie.adaugafoto5 = results[0].adaugafoto5;
                                    foaie.descriere69 = results[0].descriere69;
                                    foaie.analize69 = results[0].analize69;
                                    foaie.spital69 = results[0].spital69;
                                    foaie.online69 = results[0].online69;
                                    foaie.adaugafoto69 = results[0].adaugafoto69;
                                    foaie.descriere912 = results[0].descriere912;
                                    foaie.analize912 = results[0].analize912;
                                    foaie.spital912 = results[0].spital912;
                                    foaie.online912 = results[0].online912;
                                    foaie.adaugafoto912 = results[0].adaugafoto912;
                                    foaie.descriere1218 = results[0].descriere1218;
                                    foaie.analize1218 = results[0].analize1218;
                                    foaie.spital1218 = results[0].spital1218;
                                    foaie.online1218 = results[0].online1218;
                                    foaie.adaugafoto1218 = results[0].adaugafoto1218;
                                    foaie.descriere1824 = results[0].descriere1824;
                                    foaie.analize1824 = results[0].analize1824;
                                    foaie.spital1824 = results[0].spital1824;
                                    foaie.online1824 = results[0].online1824;
                                    foaie.adaugafoto1824 = results[0].adaugafoto1824;
                                    foaie.descriere2430 = results[0].descriere2430;
                                    foaie.analize2430 = results[0].analize2430;
                                    foaie.spital2430 = results[0].spital2430;
                                    foaie.online2430 = results[0].online2430;
                                    foaie.adaugafoto2430 = results[0].adaugafoto2430;
                                    foaie.descriere3036 = results[0].descriere3036;
                                    foaie.analize3036 = results[0].analize3036;
                                    foaie.spital3036 = results[0].spital3036;
                                    foaie.online3036 = results[0].online3036;
                                    foaie.adaugafoto3036 = results[0].adaugafoto3036;
                                    con.end();
                                    foaie.evolutiiList.push(new Global.Evolutie(0,"18 iunie","blablabla","sa puna sare pe rana"));
                                    foaie.evolutiiList.push(new Global.Evolutie(1,"19 iunie","arsura in cot","Miere"));
                                    foaie.epicrizedeetapa.push(Global.EpicrizaDeEtapa("28/29 iunie 2022"));
                                    foaie.fiseterapie.push(Global.FisaTerapie("28/29 iunie 2022"));
                                    foaie.buletinebio.push(Global.Bio("14 Iunie"));
                                    foaie.buletinehemo.push(Global.Hemo("14 Iunie"));
                                    foaie.buletinecoagulare.push(Global.Coagulare("14 Iunie"));
                                    var arsuriJsonVar = results[0].arsuri;
                                    var evolutiiJsonList= results[0].evolutii;
                                    res.render('foaie_observatie', {etichete,foaie,arsuriJsonVar,evolutiiJsonList});
                                    });
                                }
                                else {
                                    con.end();
                                    foaie.evolutiiList.push(new Global.Evolutie(0,"18 iunie","blablabla","sa puna sare pe rana"));
                                    foaie.evolutiiList.push(new Global.Evolutie(1,"19 iunie","arsura in cot","Miere"));
                                    foaie.epicrizedeetapa.push(Global.EpicrizaDeEtapa("28/29 iunie 2022"));
                                    foaie.fiseterapie.push(Global.FisaTerapie("28/29 iunie 2022"));
                                    foaie.buletinebio.push(Global.Bio("14 Iunie"));
                                    foaie.buletinehemo.push(Global.Hemo("14 Iunie"));
                                    foaie.buletinecoagulare.push(Global.Coagulare("14 Iunie"));

                                    var arsuriJsonVar = [];
                                    var evolutiiJsonList=[];
                                    res.render('foaie_observatie', {etichete,foaie,arsuriJsonVar,evolutiiJsonList});
                                }




                                });

            }
        //init, aici sa se populeze cu detaliile legate de id-ul pacientului



});




module.exports = router;