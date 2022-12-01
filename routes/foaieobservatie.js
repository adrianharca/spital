const express = require('express');
const router = express.Router();
var Global = require("../functions.js");
var Handlebars = require('handlebars');
const url = require('url');
const fs = require('fs');
const session = require('express-session');
var formidable  = require('formidable');
const path = require('path');
var mysql = require('mysql');

var idfoaie=null;
var pacientId=null;


function fileNameForField(field, idfoaie, fieldName, oldValue){
    if (field.size!=0) {
        if (fieldName!=undefined)
            return idfoaie + fieldName + field.originalFilename;
        else
            return "";
        }
    else {
    if (markedDel[fieldName]==1)
        return "";
    else if (oldValue!=undefined)
        return oldValue;
    else return "";
        }
}

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
  const uploadFolder  = "..\\"+Global.getUploadFolder();
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
var oldFiles= {};
var markedDel = {};
function insertOrUpdateInDB(req, fields, files, oldFiles){
 let errors = [];
    try {
            let {medic, sectia, ora, oraExt, idExtern,diagprincipal,locaccident, diaginternare,diag24h,diag72h,
            intoxicatii,alergii,
                              sange,rh,insotit,vechimearsuri,diagexternare,datadeces,cauzadirectadeces,
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
                              descriere3036,analize3036,adaugafoto3036,spital3036,online3036, greutateactuala, zi, luna, an, indiceponderal, salon, pat, status, lunaext, anext, ziext} = fields;

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


            var con = Global.createConnection(mysql);
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

                      if (sizeOfSelect==0) {
                                 var sql = "INSERT INTO spital.foaie_observatie ( idpacient,medic, idExtern, sectia, " +
                                 "loc, diagnosticprincipal, ora, oraExt, "
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
                               "descriere3036,analize3036,spital3036,online3036, arsuri, evolutii, greutateactuala, zi, luna, an, indiceponderal, salon, pat, status, lunaext, anext, ziext ) VALUES ?";
                                                                   var values = [
                                                                   [pacientId, medic, idExtern, sectia, locaccident,
                                                                   diagprincipal, ora, oraExt, diaginternare,diag24h,
                                                                   diag72h,intoxicatii,alergii,sange,rh,
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
                                                                                                  descriere3036,analize3036,Global.transformCheckboxField(spital3036),Global.transformCheckboxField(online3036),JSON.stringify(arsuri),JSON.stringify(evolutii), greutateactuala, zi, luna, an, indiceponderal, salon, pat, status, lunaext, anext, ziext]
                                                                   ];
                                                                   con.query(sql, [values], function (err, result) {
                                                                   if (err) throw err;

                                                                     var tempId = result.insertId;
                                                                     idfoaie = tempId;
                                                                     var sqlPhotos = "update spital.foaie_observatie " +
                                                                      " set loc='" + locaccident + "', adaugafoto0='"+
                                                                      fileNameForField (files.adaugafoto0, tempId,"adaugafoto0",oldFiles.adaugafoto0)+ "', " +
                                                                     "adaugafoto1 ='" + fileNameForField(files.adaugafoto1, tempId,"adaugafoto1",oldFiles.adaugafoto1) + "', " +
                                                                     "adaugafoto2 ='" + fileNameForField(files.adaugafoto2, tempId,"adaugafoto2",oldFiles.adaugafoto2) + "', " +
                                                                     "adaugafoto3 ='" + fileNameForField(files.adaugafoto3, tempId,"adaugafoto3",oldFiles.adaugafoto3) + "', " +
                                                                     "adaugafoto4 ='" + fileNameForField(files.adaugafoto4, tempId,"adaugafoto4",oldFiles.adaugafoto4) + "', " +
                                                                     "adaugafoto5 ='" + fileNameForField(files.adaugafoto5, tempId,"adaugafoto5",oldFiles.adaugafoto5) + "', " +
                                                                     "adaugafoto69 ='" + fileNameForField(files.adaugafoto69, tempId,"adaugafoto69",oldFiles.adaugafoto69) + "', " +
                                                                     "adaugafoto912 ='" + fileNameForField(files.adaugafoto912, tempId,"adaugafoto912",oldFiles.adaugafoto912) + "', " +
                                                                     "adaugafoto1218 ='" + fileNameForField(files.adaugafoto1218, tempId,"adaugafoto1218",oldFiles.adaugafoto1218) + "', " +
                                                                     "adaugafoto1824 ='" + fileNameForField(files.adaugafoto1824, tempId,"adaugafoto1824",oldFiles.adaugafoto1824) + "', " +
                                                                     "adaugafoto2430 ='" + fileNameForField(files.adaugafoto2430, tempId,"adaugafoto2430",oldFiles.adaugafoto2430) + "', " +
                                                                     "adaugafoto3036 ='" + fileNameForField(files.adaugafoto3036, tempId,"adaugafoto3036",oldFiles.adaugafoto3036) + "' " +
                                                                     " where idfoaie_observatie="+tempId;
                                                                     con.query(sqlPhotos, [values], function (err, result) {
                                                                                    if (err) throw err;

                                                                                    con.end();
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
                                                                                    deleteOldFiles(files, oldFiles, idfoaie, markedDel);
                                                                              });
                                                                      //res.redirect("/foaie_observatie/allFiles");
                                                                   });
                              }
                              else {
                                            var sql = "Update spital.foaie_observatie set medic='" + medic +"', " +
                                            "idExtern= '" + idExtern + "', loc ='"+
                                             locaccident + "', ora='" + ora + "', oraExt='"+ oraExt + "',"+
                                            "sectia='"+ sectia + "', diagnosticprincipal='"+diagprincipal+"',"+
                                            "diagnosticlainternare='" +diaginternare + "', diag24h='"+diag24h + "', diag72h='"+diag72h+"', intoxicatii='"+ intoxicatii+ "'," +
                                            "alergii='"+ alergii + "', sange='"+ sange + "', rh='"+ rh + "', insotit='"+ insotit + "', vechimearsuri='"+vechimearsuri + "'," +
                                            "diagnosticexternare='"+ diagexternare + "',datadeces='"+ datadeces+ "', cauzadirectadeces='"+ cauzadirectadeces+ "', cauzaantecedentadeces='"+ cauzaantecedentadeces+ "', starimorbideinitiale='"+starimorbideinitiale + "', starimorbideimportante='"+ starimorbideimportante + "',prezentaparinti='"+ Global.transformCheckboxField(prezentaparinti)+ "',descriere='"+ descriere + "',locprimajutor='"+ locajutor+ "',"+
                                            "tratamentprimajutor='"+ tratamentajutor+ "',unitatiintermediare='"+ unitatiintermediare+ "',tratamentanterior='"+ tratamentanterior+ "',transport='"+ transport+ "',tratasport='"+ tratasport+ "',stare='"+ starepacient+ "',timp='"+ timp+ "', epicrizafinala='"+ epicrizafinala+ "',medicatie='"+ medicatie+ "',kineto='"+ kineto+ "', comments='"+ recomments+ "',"+
                                            "cantitatelichide='"+ cantitatelichide+ "', cantlichide8h='"+ cantlichide8h+ "', cantlichide16h='"+ cantlichide16h+ "', cantlichide24h='"+ cantlichide24h+ "', dinamicaplagi='"+ dinamicaplagi+ "', cura='"+ cura+ "', caiResp='"+ Global.transformCheckboxField(caiResp)+ "',"+
                                            "descriere1='"+ descriere1 + "',analize1='"+ analize1+ "',adaugafoto1='"+ fileNameForField(files.adaugafoto1, idfoaie,"adaugafoto1",oldFiles.adaugafoto1) + "',spital1='"+ Global.transformCheckboxField(spital1) + "',online1='"+ Global.transformCheckboxField(online1) + "',"+
                                            "descriere2='"+ descriere2 + "',analize2='"+ analize2+ "',adaugafoto2='"+ fileNameForField(files.adaugafoto2, idfoaie,"adaugafoto2",oldFiles.adaugafoto2) + "',spital2='"+ Global.transformCheckboxField(spital2) + "',online2='"+ Global.transformCheckboxField(online2) + "',"+
                                            "descriere3='"+ descriere3 + "',analize3='"+ analize3 + "',adaugafoto3='"+ fileNameForField(files.adaugafoto3, idfoaie,"adaugafoto3",oldFiles.adaugafoto3) + "',spital3='"+ Global.transformCheckboxField(spital3) + "',online3='"+ Global.transformCheckboxField(online3) + "',"+
                                            "descriere4='"+ descriere4 + "',analize4='"+ analize4 + "',adaugafoto4='"+ fileNameForField(files.adaugafoto4, idfoaie,"adaugafoto4",oldFiles.adaugafoto4) + "',spital4='"+ Global.transformCheckboxField(spital4) + "',online4='"+ Global.transformCheckboxField(online4) + "',"+
                                            "descriere5='"+ descriere5 + "',analize5='"+ analize5 + "',adaugafoto5='"+ fileNameForField(files.adaugafoto5, idfoaie,"adaugafoto5",oldFiles.adaugafoto5) + "',spital5='"+ Global.transformCheckboxField(spital5) + "',online5='"+ Global.transformCheckboxField(online5) + "',"+
                                            "descriere69='"+ descriere69 + "',analize69='"+ analize69 + "',adaugafoto69='"+ fileNameForField(files.adaugafoto69, idfoaie,"adaugafoto69",oldFiles.adaugafoto69) + "',spital69='"+ Global.transformCheckboxField(spital69) + "',online69='"+ Global.transformCheckboxField(online69) + "',"+
                                            "descriere912='"+ descriere912 + "',analize912='"+ analize912 + "',adaugafoto912='"+ fileNameForField(files.adaugafoto912, idfoaie,"adaugafoto912",oldFiles.adaugafoto912) + "',spital912='"+ Global.transformCheckboxField(spital912) + "',online912='"+ Global.transformCheckboxField(online912) + "',"+
                                            "descriere1218='"+ descriere1218 + "',analize1218='"+ analize1218 + "',adaugafoto1218='"+ fileNameForField(files.adaugafoto1218, idfoaie,"adaugafoto1218",oldFiles.adaugafoto1218) + "',spital1218='"+ Global.transformCheckboxField(spital1218) + "',online1218='"+ Global.transformCheckboxField(online1218) + "',"+
                                            "descriere1824='"+ descriere1824+ "',analize1824='"+ analize1824 + "',adaugafoto1824='"+ fileNameForField(files.adaugafoto1824, idfoaie,"adaugafoto1824",oldFiles.adaugafoto1824) + "',spital1824='"+ Global.transformCheckboxField(spital1824) + "',online1824='"+ Global.transformCheckboxField(online1824) + "',"+
                                            "descriere2430='"+ descriere2430+ "',analize2430='"+ analize2430 + "',adaugafoto2430='"+ fileNameForField(files.adaugafoto2430, idfoaie,"adaugafoto2430",oldFiles.adaugafoto2430) + "',spital2430='"+ Global.transformCheckboxField(spital2430) + "',online2430='"+ Global.transformCheckboxField(online2430) + "',"+
                                            "descriere3036='"+ descriere3036+ "',analize3036='"+ analize3036 + "',adaugafoto3036='"+ fileNameForField(files.adaugafoto3036, idfoaie,"adaugafoto3036",oldFiles.adaugafoto3036) + "',spital3036='"+ Global.transformCheckboxField(spital3036) + "',online3036='"+ Global.transformCheckboxField(online3036) + "', " +
                                            "arsuri='"+ JSON.stringify(arsuri) +"', evolutii='" + JSON.stringify(evolutii) + "', adaugafoto0='"+ fileNameForField(files.adaugafoto0, idfoaie,"adaugafoto0",oldFiles.adaugafoto0) + "', greutateactuala='"+ greutateactuala + "', zi='"+ zi+"', luna='" + luna + "', an='" + an + "', indiceponderal='" + indiceponderal +"', salon='" + salon +"',pat='" +pat +
                                            "', status= '" + status + "', lunaext='" + lunaext +"', ziext = '" + ziext + "', anext='" + anext + "' where idfoaie_observatie="+idfoaie;

                                            con.query(sql, function (err, result) {
                                                        if (err) throw err;
                                                        con.end();
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
                                                        deleteOldFiles(files, oldFiles, idfoaie, markedDel);
                                                        //res.redirect("/foaie_observatie/allFiles");
                                            });

                              }
                      });
                      }
                        else {
                        res.render('foaie_observatie', {
                                                          errors,
                                                          foaie
                                                        });

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

router.post('/', (req, res) => {
    if (req.session==undefined  || req.session.userid==undefined) {
        res.redirect('/users/login');
        return;
    };
    var formData = new formidable.IncomingForm();
    const query = url.parse(req.url, true).query;
    const data = query.data;
    pacientId = query.pacient;
    idfoaie = query.foaie;




    //+ "." + file.originalFilename.split('.').pop()
    formData.parse(req, async (err, fields, files) => {
    errors = [];
    if (fields.idExtern=='') {
                  errors.push ({"text": "Numărul de înregistrare SC nu este completat."});
                  };
    if (fields.medic=='') {
              errors.push ({"text": "Medicul nu este completat."});
              };
    if (fields.sectia=='') {
              errors.push ({"text": "Secția nu este completată."});
              };
    if (fields.diagprincipal=='') {
              errors.push ({"text": "Diagnosticul principal nu este completat."});
              };
    if (fields.indiceponderal!=undefined) {
        if (isNaN(fields.indiceponderal)) {
            errors.push ({"text": "Indicele ponderal nu este numeric."});
        }
    }
    if (fields.greutateactuala!=undefined) {
            if (isNaN(fields.greutateactuala)) {
                errors.push ({"text": "Greutatea actuală nu este numerică."});
            }
    }

    if (!Global.checkEmpty(fields.an) && !Global.checkEmpty(fields.luna) && !Global.checkEmpty(fields.zi) &&
    !Global.checkEmpty(fields.anext) &&
    !Global.checkEmpty(fields.lunaext) && !Global.checkEmpty(fields.ziext))  {
        var dataInternare = new Date(fields.an, Global.convertLuna(fields.luna), fields.zi);
        var dataExternare = new Date(fields.anext, Global.convertLuna(fields.lunaext), fields.ziext);
        if (dataExternare<dataInternare) {
             errors.push ({"text": "Verificați vă rog data externării, care nu poate fi anterioară datei internării."});
        }
    }
    if (errors.length>0){
        medic = fields.medic;

        sectia = fields.sectia;
        constructFoaie(errors, req, res, fields);
    }
    else {
        markedDel.adaugafoto0 = fields.markedDel0;
        markedDel.adaugafoto1 = fields.markedDel1;
        markedDel.adaugafoto2 = fields.markedDel2;
        markedDel.adaugafoto3 = fields.markedDel3;
        markedDel.adaugafoto4 = fields.markedDel4;
        markedDel.adaugafoto5 = fields.markedDel5;
        markedDel.adaugafoto69 = fields.markedDel69;
        markedDel.adaugafoto912 = fields.markedDel912;
        markedDel.adaugafoto1218 = fields.markedDel1218;
        markedDel.adaugafoto1824 = fields.markedDel1824;
        markedDel.adaugafoto2430 = fields.markedDel2430;
        markedDel.adaugafoto3036 = fields.markedDel3036;

        insertOrUpdateInDB(req, fields, files, oldFiles);

        if (err) {
            console.log("Error parsing the files");
            return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
        });
        }
     else {
       var selectAllFiles = "select idfoaie_observatie,pacient.idpacient, numefamilie, prenume, foaie_observatie.medic, foaie_observatie.sectia, foaie_observatie.CURRENT_TIMESTAMP as timeCol from spital.foaie_observatie inner join spital.pacient on pacient.idpacient=foaie_observatie.idpacient order by idfoaie_observatie limit 100";
           const query = url.parse(req.url, true).query;
           var page = query.page;
           if (page!=null) {
               selectAllFiles = selectAllFiles + " offset " + page*100;
           }

       var con = Global.createConnection(mysql);
         con.connect(function(err) {
           if (err) throw err;
           con.query(selectAllFiles, function (err, result, fields) {
             if (err) throw err;
            // res.redirect('/foaie_observatie/allFiles'  );
             res.redirect('/pacients');
             con.end();
           });
           });
    }
    }

    });

});
router.get('/allFiles', (req, res) => {
    if (req.session==undefined  || req.session.userid==undefined) {
        res.redirect('/users/login');
        return;
    };
    var selectAllFiles = "select idfoaie_observatie,pacient.idpacient, numefamilie, prenume, foaie_observatie.medic,"
    + " foaie_observatie.sectia, foaie_observatie.CURRENT_TIMESTAMP as timeCol," +
    "foaie_observatie.zi, foaie_observatie.luna, foaie_observatie.an from spital.foaie_observatie "
    + " inner join spital.pacient on pacient.idpacient=foaie_observatie.idpacient order by idfoaie_observatie limit "
    + " 100";
    const query = url.parse(req.url, true).query;
    var page = query.page;
    if (page!=null) {
        selectAllFiles = selectAllFiles + " offset " + page*100;
    }

var con = Global.createConnection(mysql);
  con.connect(function(err) {
    if (err) throw err;
    con.query(selectAllFiles, function (err, result, fields) {
      if (err) throw err;
      res.render('foi', result  );
      con.end();
    });
    });
});
function deleteOldFile(value,files, oldFiles, idfoaie, markedDel) {
        if (oldFiles[value]!=undefined) {
        oldFileName = Global.getUploadFolder() + "\\" + encodeURIComponent(oldFiles[value].replace(/\s/g, "-"));

        if ((markedDel[value])==1) {
                fs.unlink(oldFileName,function(err){
                                                    if(err) return console.log(err);
                                               });
        }
        else if (files[value].originalFilename.localeCompare("")!=0 ) {
            fs.unlink(oldFileName,function(err){
                                    if(err) return console.log(err);
                               });
        }
        }
}
function deleteOldFiles(files, oldFiles, idfoaie,markedDel){
    deleteOldFile("adaugafoto0",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto1",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto2",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto3",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto4",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto5",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto69",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto912",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto1218",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto1824",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto2430",files, oldFiles, idfoaie,markedDel);
    deleteOldFile("adaugafoto3036",files, oldFiles, idfoaie,markedDel);
}
router.get('/delete', (req,res) => {
     if (req.session==undefined  || req.session.userid==undefined) {
        res.redirect('/users/login');
        return;
      };
    const query = url.parse(req.url, true).query;
    const data = query.data;
    var id = query.id;
    if (id!=undefined){
        var con = Global.createConnection(mysql);
        selectSql = "select idfoaie_observatie from spital.foaie_observatie where idfoaie_observatie=" + id;
        deleteSql = "delete from spital.foaie_observatie where idfoaie_observatie=" + id;
        con.connect(function (err) {
         con.query(selectSql, function (err, result, fields) {
                              if (err) throw err;
                              for(var i=0;i<result.length;i++) {
                                Global.deleteFile(result[i].idfoaie_observatie + "adaugafoto");
                              }
                              con.query(deleteSql, function (errDel, resultDel, fieldsDel) {
                                if (errDel) throw err;
                                con.end();
                                res.redirect('/pacients' );

                              });

                            });
        });
    }
    else {
       res.redirect('/pacients' );
    }

});
function constructFoaie(errors, req, res, fieldsOld) {

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

        if (pacientId!=undefined)
            {
                 var con = Global.createConnection(mysql);
                      con.connect(function(err) {
                      if (err) throw err;

                      });
                      var select = "SELECT idpacient,prenume, numefamilie, zi, luna, an, sex, cnp, cod,(select GROUP_CONCAT(nume) from spital.utilizator where rol like '%medic%') medici, (select sectii from spital.setup) sectii FROM spital.pacient where idpacient=" + pacientId;
                      con.query(select, (error, results, fields) => {
                                if (error) {
                                            return console.error(error.message);
                                }
                                if (results[0].medici!=undefined)
                                    foaie.medici = results[0].medici.split(",");
                                else
                                    foaie.medici = "";
                                foaie.sectii = JSON.parse(results[0].sectii);
                                foaie.sectiiVar = JSON.stringify(foaie.sectii);
                                foaie.detaliipacient.nume  =results[0].numefamilie + " " + results[0].prenume;

                                foaie.detaliipacient.varsta = Global.calculateAge(results[0].zi,results[0].luna, results[0].an);
                                foaie.detaliipacient.sex = results[0].sex;
                                foaie.detaliipacient.cnp = results[0].cnp;
                                foaie.detaliipacient.cod = results[0].cod;
                                foaie.detaliipacient.id = results[0].idpacient;
                                oldFiles = {};
                                markedDel = {};
                                if (idfoaie!=null) {
                                    foaie.detaliipacient.idfoaie = idfoaie;
                                    var selectFoaieObservatie = "SELECT * FROM spital.foaie_observatie where idfoaie_observatie=" + idfoaie;
                                    con.query(selectFoaieObservatie, (error, results, fields) => {
                                                                    if (error) {
                                                                                return console.error(error.message);
                                                                    }
                                    if (results[0]!=null) {
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
                                    foaie.zi = results[0].zi;
                                    foaie.luna = results[0].luna;
                                    foaie.an = results[0].an;
                                    foaie.ziext = results[0].ziext;
                                    foaie.lunaext = results[0].lunaext;
                                    foaie.anext = results[0].anext;
                                    foaie.greutateactuala = results[0].greutateactuala;
                                    foaie.sange = results[0].sange;
                                    foaie.alergii = results[0].alergii;
                                    foaie.intoxicatii = results[0].intoxicatii;
                                    foaie.diag72h = results[0].diag72h;
                                    foaie.diag24h = results[0].diag24h;
                                    foaie.status = results[0].status;
                                    foaie.indiceponderal = results[0].indiceponderal;
                                    foaie.salon = results[0].salon;
                                    foaie.pat = results[0].pat;
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
                                    foaie.adaugafoto0 = results[0].adaugafoto0;
                                    foaie.idExtern = results[0].idExtern;
                                    foaie.ora = results[0].ora;
                                    foaie.oraExt = results[0].oraExt;
                                    markedDel.adaugafoto0 = "0";
                                    oldFiles.adaugafoto0 = results[0].adaugafoto0;
                                    foaie.adaugafoto1 = results[0].adaugafoto1;
                                    markedDel.adaugafoto1 = "0";
                                    oldFiles.adaugafoto1 = results[0].adaugafoto1;
                                    foaie.descriere2 = results[0].descriere2;
                                    foaie.analize2 = results[0].analize2;
                                    foaie.spital2 = results[0].spital2;
                                    foaie.online2 = results[0].online2;
                                    markedDel.adaugafoto2 = "0";
                                    foaie.adaugafoto2 = results[0].adaugafoto2;
                                    oldFiles.adaugafoto2 = results[0].adaugafoto2;
                                    foaie.descriere3 = results[0].descriere3;
                                    foaie.analize3 = results[0].analize3;
                                    foaie.spital3 = results[0].spital3;
                                    foaie.online3 = results[0].online3;
                                    markedDel.adaugafoto3 = "0";
                                    foaie.adaugafoto3 = results[0].adaugafoto3;
                                    oldFiles.adaugafoto3 = results[0].adaugafoto3;
                                    foaie.descriere4 = results[0].descriere4;
                                    foaie.analize4 = results[0].analize4;
                                    foaie.spital4 = results[0].spital4;
                                    foaie.online4 = results[0].online4;
                                    foaie.adaugafoto4 = results[0].adaugafoto4;
                                    markedDel.adaugafoto4 = "0";
                                    oldFiles.adaugafoto4 = results[0].adaugafoto4;
                                    foaie.descriere5 = results[0].descriere5;
                                    foaie.analize5 = results[0].analize5;
                                    foaie.spital5 = results[0].spital5;
                                    foaie.online5 = results[0].online5;
                                    markedDel.adaugafoto5 = "0";
                                    foaie.adaugafoto5 = results[0].adaugafoto5;
                                    oldFiles.adaugafoto5 = results[0].adaugafoto5;
                                    foaie.descriere69 = results[0].descriere69;
                                    foaie.analize69 = results[0].analize69;
                                    foaie.spital69 = results[0].spital69;
                                    foaie.online69 = results[0].online69;
                                    markedDel.adaugafoto69 = "0";
                                    oldFiles.adaugafoto69 = results[0].adaugafoto69;
                                    foaie.adaugafoto69 = results[0].adaugafoto69;
                                    foaie.descriere912 = results[0].descriere912;
                                    foaie.analize912 = results[0].analize912;
                                    foaie.spital912 = results[0].spital912;
                                    foaie.online912 = results[0].online912;
                                    markedDel.adaugafoto912 = "0";
                                    foaie.anamneza.loc = results[0].loc;
                                    oldFiles.adaugafoto912 = results[0].adaugafoto912;
                                    foaie.adaugafoto912 = results[0].adaugafoto912;
                                    foaie.descriere1218 = results[0].descriere1218;
                                    foaie.analize1218 = results[0].analize1218;
                                    foaie.spital1218 = results[0].spital1218;
                                    foaie.online1218 = results[0].online1218;
                                    markedDel.adaugafoto1218 = "0";
                                    oldFiles.adaugafoto1218 = results[0].adaugafoto1218;
                                    foaie.adaugafoto1218 = results[0].adaugafoto1218;
                                    foaie.descriere1824 = results[0].descriere1824;
                                    foaie.analize1824 = results[0].analize1824;
                                    foaie.spital1824 = results[0].spital1824;
                                    foaie.online1824 = results[0].online1824;
                                    markedDel.adaugafoto1824 = "0";
                                    oldFiles.adaugafoto1824 = results[0].adaugafoto1824;
                                    foaie.adaugafoto1824 = results[0].adaugafoto1824;
                                    foaie.descriere2430 = results[0].descriere2430;
                                    foaie.analize2430 = results[0].analize2430;
                                    foaie.spital2430 = results[0].spital2430;
                                    foaie.online2430 = results[0].online2430;
                                    markedDel.adaugafoto2430 = "0";
                                    foaie.adaugafoto2430 = results[0].adaugafoto2430;
                                    oldFiles.adaugafoto2430 = results[0].adaugafoto2430;
                                    foaie.descriere3036 = results[0].descriere3036;
                                    foaie.analize3036 = results[0].analize3036;
                                    foaie.spital3036 = results[0].spital3036;
                                    foaie.online3036 = results[0].online3036;
                                    markedDel.adaugafoto3036 = "0";
                                    foaie.adaugafoto3036 = results[0].adaugafoto3036;
                                    oldFiles.adaugafoto3036 = results[0].adaugafoto3036;
                                    var arsuriJsonVar = results[0].arsuri;
                                    var evolutiiJsonList= results[0].evolutii;
                                    var selectFiseTerapie = "SELECT idfisa_terapie_intensiva, data, id_foaie FROM spital.fisa_terapie_intensiva where id_foaie=" + idfoaie;
                                    con.query(selectFiseTerapie, (error, results, fields) => {
                                        if (error) {
                                                    return console.error(error.message);
                                        }
                                        if (results!=null) {
                                          for (var i=0;i<results.length;i++){
                                                  foaie.fiseterapie.push(new Global.FisaTerapie(results[i].data, results[i].idfisa_terapie_intensiva, results[i].id_foaie));
                                          }
                                       }
                                    }
                                    );
                                    var selectEpicrize = "SELECT idepicrize_etapa, dataVar FROM spital.epicrize_etapa where idfoaie=" + idfoaie + " order by idepicrize_etapa desc";
                                    con.query(selectEpicrize, (error, results, fields) => {
                                                                        if (error) {
                                                                               return console.error(error.message);
                                                                        }
                                                                        if (results!=null) {
                                                                            for (var i=0;i<results.length;i++){
                                                                                foaie.epicrizedeetapa.push(new Global.FisaTerapie(results[i].dataVar, results[i].idepicrize_etapa, idfoaie,pacientId));
                                                                            }
                                                                        }
                                                                        //foaie.fiseterapie.push(Global.FisaTerapie("28/29 iunie 2022"));
                                                                        //foaie.buletinebio.push(Global.Bio("14 Iunie"));
                                                                        //foaie.buletinehemo.push(Global.Hemo("14 Iunie"));
                                                                        //foaie.buletinecoagulare.push(Global.Coagulare("14 Iunie"));


                                                                        con.end();
                                                                        res.render('foaie_observatie', {errors, etichete,foaie,arsuriJsonVar,evolutiiJsonList});
                                                                        });



                                    // foaie.epicrizedeetapa.push(Global.EpicrizaDeEtapa("28/29 iunie 2022"));

                                    }

                                    });
                                }
                                else {
                                    con.end();
                                    foaie.zi = new Date().getDate();
                                    foaie.luna = Global.convertNumberToMonth(new Date().getMonth());
                                    foaie.an = new Date().getFullYear();
                                    if (fieldsOld!=null) {
                                        foaie.medic = fieldsOld.medic;
                                        foaie.sectia = fieldsOld.sectia;
                                        foaie.salon = fieldsOld.salon;
                                        foaie.pat = fieldsOld.pat;
                                        foaie.zi= fieldsOld.zi;
                                        foaie.luna = fieldsOld.luna;
                                        foaie.an = fieldsOld.an;
                                        foaie.ora = fieldsOld.ora;
                                        foaie.oraExt = fieldsOld.oraExt;
                                        foaie.ziext= fieldsOld.ziext;
                                        foaie.lunaext = fieldsOld.lunaext;
                                        foaie.anext = fieldsOld.anext;
                                        foaie.diagnosticprincipal = fieldsOld.diagprincipal;
                                        foaie.diagnosticlainternare = fieldsOld.diaginternare;
                                        foaie.diag24h = fieldsOld.diag24h;
                                        foaie.diag72h = fieldsOld.diag72h;
                                        foaie.diag72h = fieldsOld.diag72h;
                                        foaie.intoxicatii = fieldsOld.intoxicatii;
                                        foaie.alergii = fieldsOld.alergii;
                                        foaie.indiceponderal = fieldsOld.indiceponderal;
                                        foaie.greutateactuala = fieldsOld.greutateactuala;
                                        foaie.sange = fieldsOld.sange;
                                        fieldsOld.caiResp!=undefined ? foaie.caiResp = "1" : foaie.caiResp = "0";
                                        foaie.rh = fieldsOld.rh;
                                        foaie.insotit = fieldsOld.insotit;
                                        foaie.vechimearsuri = fieldsOld.vechimearsuri;
                                        foaie.diagnosticexternare = fieldsOld.diagexternare;
                                        foaie.datadeces = fieldsOld.datadeces;
                                        foaie.cauzadirectadeces = fieldsOld.cauzadirectadeces;
                                        foaie.cauzaantecedentadeces = fieldsOld.cauzaantecedentadeces;
                                        foaie.starimorbideinitiale = fieldsOld.starimorbideinitiale;
                                        foaie.starimorbideimportante = fieldsOld.starimorbideimportante;
                                        foaie.anamneza = {};
                                        (fieldsOld.prezentaparinti!=undefined) ? foaie.anamneza.prezentaparinti = "1"
                                         :foaie.anamneza.prezentaparinti = "0";

                                        foaie.anamneza.loc = fieldsOld.locaccident;
                                        foaie.anamneza.descriere = fieldsOld.descriere;
                                        foaie.anamneza.locprimajutor = fieldsOld.locajutor;
                                        foaie.anamneza.tratamentprimajutor = fieldsOld.tratamentajutor;
                                        foaie.anamneza.unitatiintermediare = fieldsOld.unitatiintermediare;
                                        foaie.anamneza.tratamentanterior = fieldsOld.tratamentanterior;
                                        foaie.anamneza.transport = fieldsOld.transport;
                                        foaie.anamneza.tratasport = fieldsOld.tratasport;
                                        foaie.anamneza.stare = fieldsOld.starepacient;
                                        foaie.anamneza.timp = fieldsOld.timp;
                                        foaie.anamneza.cantitatelichide = fieldsOld.cantitatelichide;
                                        foaie.anamneza.cantlichide8h = fieldsOld.cantlichide8h;
                                        foaie.anamneza.cantlichide16h = fieldsOld.cantlichide16h;
                                        foaie.anamneza.cantlichide24h = fieldsOld.cantlichide24h;
                                        foaie.anamneza.dinamicaplagi = fieldsOld.dinamicaplagi;
                                        foaie.epicrizafinala = fieldsOld.epicrizafinala;
                                        foaie.medicatie = fieldsOld.medicatie;
                                        foaie.kineto = fieldsOld.kineto;
                                        foaie.comments = fieldsOld.recomments;
                                        foaie.cura = fieldsOld.cura;
                                        foaie.status = fieldsOld.status;
                                        foaie.markedDel0 = fieldsOld.markedDel0;
                                        foaie.descriere1 = fieldsOld.descriere1;
                                        foaie.analize1 = fieldsOld.analize1;
                                        (fieldsOld.spital1!=undefined) ? foaie.spital1="1" : foaie.spital1="0";
                                        (fieldsOld.online1!=undefined) ? foaie.online1="1" : foaie.online1="0";
                                        foaie.markedDel1 = fieldsOld.markedDel1;
                                        foaie.descriere2 = fieldsOld.descriere2;
                                        foaie.analize2 = fieldsOld.analize2;
                                        (fieldsOld.spital2!=undefined) ? foaie.spital2="1" : foaie.spital2="0";
                                        (fieldsOld.online2!=undefined) ? foaie.online2="1" : foaie.online2="0";
                                        foaie.markedDel2 = fieldsOld.markedDel2;
                                        foaie.descriere3 = fieldsOld.descriere3;
                                        foaie.analize3 = fieldsOld.analize3;
                                        foaie.idExtern = fieldsOld.idExtern;
                                        (fieldsOld.spital3!=undefined) ? foaie.spital3="1" : foaie.spital3="0";
                                        (fieldsOld.online3!=undefined) ? foaie.online3="1" : foaie.online3="0";
                                        foaie.markedDel3 = fieldsOld.markedDel3;
                                        foaie.descriere4 = fieldsOld.descriere4;
                                        foaie.analize4 = fieldsOld.analize4;
                                        (fieldsOld.spital4!=undefined) ? foaie.spital4="1" : foaie.spital4="0";
                                        (fieldsOld.online4!=undefined) ? foaie.online4="1" : foaie.online4="0";
                                        foaie.markedDel4 = fieldsOld.markedDel4;
                                        foaie.descriere5 = fieldsOld.descriere5;
                                        foaie.analize5 = fieldsOld.analize5;
                                        (fieldsOld.spital5!=undefined) ? foaie.spital5="1" : foaie.spital5="0";
                                        (fieldsOld.online5!=undefined) ? foaie.online5="1" : foaie.online5="0";
                                        foaie.markedDel5 = fieldsOld.markedDel5;
                                        foaie.descriere69 = fieldsOld.descriere69;
                                        foaie.analize69 = fieldsOld.analize69;
                                        (fieldsOld.spital69!=undefined) ? foaie.spital69="1" : foaie.spital69="0";
                                        (fieldsOld.online69!=undefined) ? foaie.online69="1" : foaie.online69="0";
                                        foaie.markedDel69 = fieldsOld.markedDel69;
                                        foaie.descriere912 = fieldsOld.descriere912;
                                        foaie.analize912 = fieldsOld.analize912;
                                        (fieldsOld.spital912!=undefined) ? foaie.spital912="1" : foaie.spital912="0";
                                        (fieldsOld.online912!=undefined) ? foaie.online912="1" : foaie.online912="0";
                                        foaie.markedDel912 = fieldsOld.markedDel912;
                                        foaie.descriere1218 = fieldsOld.descriere1218;
                                        (fieldsOld.spital1218!=undefined) ? foaie.spital1218="1" : foaie.spital1218="0";
                                        (fieldsOld.online1218!=undefined) ? foaie.online1218="1" : foaie.online1218="0";
                                        foaie.analize1218 = fieldsOld.analize1218;
                                        foaie.markedDel1218 = fieldsOld.markedDel1218;
                                        foaie.descriere1824 = fieldsOld.descriere1824;
                                        (fieldsOld.spital1824!=undefined) ? foaie.spital1824="1" : foaie.spital1824="0";
                                        (fieldsOld.online1824!=undefined) ? foaie.online1824="1" : foaie.online1824="0";
                                        foaie.analize1824 = fieldsOld.analize1824;
                                        foaie.markedDel1824 = fieldsOld.markedDel1824;
                                        foaie.descriere2430 = fieldsOld.descriere2430;
                                        foaie.analize2430 = fieldsOld.analize2430;
                                        foaie.markedDel2430 = fieldsOld.markedDel2430;
                                        (fieldsOld.spital2430!=undefined) ? foaie.spital2430="1" : foaie.spital2430="0";
                                        (fieldsOld.online2430!=undefined) ? foaie.online2430="1" : foaie.online2430="0";
                                        foaie.descriere3036 = fieldsOld.descriere3036;
                                        foaie.analize3036 = fieldsOld.analize3036;
                                        foaie.markedDel3036 = fieldsOld.markedDel3036;
                                        (fieldsOld.spital3036!=undefined) ? foaie.spital3036="1" : foaie.spital3036="0";
                                        (fieldsOld.online3036!=undefined) ? foaie.online3036="1" : foaie.online3036="0";
                                    }
                                    //foaie.fiseterapie.push(Global.FisaTerapie("28/29 iunie 2022"));
                                   // foaie.buletinebio.push(Global.Bio("14 Iunie"));
                                    //foaie.buletinehemo.push(Global.Hemo("14 Iunie"));
                                    //foaie.buletinecoagulare.push(Global.Coagulare("14 Iunie"));

                                    var arsuriJsonVar = [];
                                    var evolutiiJsonList=[];
                                    res.render('foaie_observatie', {errors,etichete,foaie,arsuriJsonVar,evolutiiJsonList});
                                }




                                });
         }
         else {
            res.send("Foaia de observație nu a putut fi generată, pentru că id-ul pacientului nu a fost găsit în query string (adică adresa arată așa: https://site/foaie_observatie , fără '?pacient=numar'). Reîncărcați aplicatia, selectați un pacient din listă și alegeți o foaie de observație sau generați una nouă din buton");
         }
}
router.get('/', (req, res) => {
        if (req.session==undefined  || req.session.userid==undefined) {
            res.redirect('/users/login');
            return;
        };
        const query = url.parse(req.url, true).query;
        const data = query.data;
        pacientId = query.pacient;
        idfoaie = query.foaie;
        constructFoaie([], req, res, null);


            }
        //init, aici sa se populeze cu detaliile legate de id-ul pacientului
);




module.exports = router;