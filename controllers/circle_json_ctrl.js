var Circle = require("../models/Circle");
var ImageEntity = require("../models/ImageEntity");
var Image = require("../models/Image");
var When= require('../models/When');
var whereMaker=require('../models/Where');
var Global = require("../functions.js");
require("../functions.js");
//var router= require('../server')
console.log("circle_json_ctrl");

// exports.demoadd = function (req, res) {
//   const data = {
//     theme: 'bich',
//     description: 'b cray',
//     initiatorid: '0',
//   }
//   let { theme, description, initiatorid } = data;

//   Circle.create({
//     data
//   }).then(a => {
//     console.log('created circle ' + theme);
//     res.redirect('/circles')
//   })
//     .catch(err => console.log(err));
// };

function renderCircle(c) {
  var container = new Object();
  // Object.assign(container, c); is di proper way to clone objs in js
  const fields = ['id', 'theme', 'description', 'status',
    'initiatorid', 'image', ' invitationOnly', 'openToAnyone',
    'createdAt', 'updatedAt', 'deletedAt'];
  fields.forEach((item, k) => {
    console.log(item, ' ', c[item]);
    container[item] = c[item];
  });
  container.keywords = [];
  container.keywords = c.keywords == null ? [] : c.keywords.split(",");
  // container.creationDate = new Date(circleFound.creationDate);

  if (c.date != undefined) {
    // var when = {};
    // when.date = Date.parse(c.date);
    // when.endDate = Date.parse(c.endDate);
    // when.timeofday = c.timeOfDay;
    // container.when = when;
    container.when = new When(c);
  }
  if (c.location != null) {
    container.where = new whereMaker(c.placename, c.spotType, c.location);
  }


  //container.image = undefined;
  container.image = c.data;
  return container;
};


exports.addByThemeDescriptionAndInit = function (req, res) {
  let { theme, description, initiatorid } = req.body;
  let errors = [];

  // Validate Fields
  // if (!theme) {
  //   errors.push({ text: 'Please add a title' });
  // }
  // if (!description) {

  //   errors.push({ text: 'Please add a description' });
  // }
  // //   if(!contact_email) {
  // //     errors.push({ text: 'Please add a contact email' });
  // //   }

  // Check for errors
  if (errors.length > 0) {
    res.put('err', {
      errors
    });
  } else {


    // Make lowercase and remove space after comma
    //  technologies = technologies.toLowerCase().replace(/, /g, ',');

    // Insert into table
    Circle.create({
      theme, description, initiatorid
    })
      .then(a => {
        console.log('success');
        res.redirect('/circles')
      })
      .catch(err => console.log(err));

  }
};
exports.delete = function (req, res) {
  console.log('deleted');
};
exports.getCircleByid = function (req, res) {

  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  circless = Circle.findOne({ where: { id: idS } })

    .then(function (c) {
      res.setHeader('Content-Type', 'application/json');
      console.log('Circle found ');
      var container = renderCircle(c);
      console.log(container);

      res.json({ container });
    }).error(function (err) {
      console.log("Error:" + err);
    });
};

exports.downloadImageById = function (req, res) {

  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "circles";
  var pathC = require("path");
  var shell = require('shelljs');
  images = ImageEntity.findOne({ where: { entityId: idS, entityType: "Circle" } }).then(function (imageFound) {
    if (imageFound != null) {
      var file = fs.readFileSync(pathC.resolve(imageFound.path), 'binary');
      res.setHeader('Content-Length', file.length);
      res.write(file, 'binary');
      res.end();
    }
    else {
      res.send("null");
    }
  }
  );

};

exports.getAll = function (req, res) {
  console.log('performing fetch all circles');

  res.removeHeader;
  var result = [];
  Circle.findAll()
    .map(l => {
      return renderCircle(l);
    })
    .then(
      c => {
        res.contentType('application/json');
        res.json(c);

        console.log('result: ' + result + ' ');
      })

    .catch(err => console.log(err));
};

exports.getImageById = function (req, res) {
  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "circles";
  var pathC = require("path");
  var shell = require('shelljs');
  images = ImageEntity.findOne({ where: { entityId: idS, entityType: "Circle" } }).then(function (imageFound) {
    if (imageFound != null) {
      Image.findOne({where: {id: imageFound.imageId}}).then(function (imageEntityFound)
      {
        if (imageEntityFound!=null)
          res.sendFile(pathC.resolve(imageEntityFound.path));
          else
          res.send("null");
      });
     
    }
    else {
      res.send("null");
    }
  }).error(function (err) {
    console.log("Error:" + "no image found");
    res.send(err);
  });
};


exports.updatebyId = function (req, res) {
  console.log("update by Id");

  idS = Number(req.params.id);

  //not forget to install npm install shelljs
  //npm install buffer
  if (req.body.image != undefined) {
    var filename = Global.createFile(req.body.image, req.body.theme + "-" + req.body.description, "circles");
    if (filename != "")
      ImageEntity.update(
        { path: filename },
        { where: { entityId: req.body.id, entityType: "Circle" } }

      ).
        then(function () {
        });
    console.log("Project with id " + req.body.id + " updated successfully-!");
  }
  res.send("ok");
};


exports.deleteByid = function (req, res) {
  console.log('delbyid');
};

exports.addOne = function (req, res) {

  let { theme, description, keywords, invitationOnly, numberOfPeople, openToAnyone,
    status, initiatorId, when, where } = req.body;
  var isflexibleVar = null;
  var dateVar = null;
  var endDateVar = null;
  var keywordsVar = null;
  var timeofdayVar = null;
  var locationVar = null;
  var placenameVar = null;
  var spottypeVar = null;
  var initiatoridVar = null;
  if (when != undefined) {
    isflexibleVar = when.isFlexible;
    timeofdayVar = when.timeOfDay;
    dateVar = Date.parse(when.date);
    endDateVar = null;
    if (when.endDate != null)
      endDateVar = Date.parse(when.endDate);
  }
  if (keywords != undefined) {
    keywordsVar = keywords.toString();
  }

  if (where != undefined) {

    locationVar = where.location;
    placenameVar = where.placename;
    spottypeVar = where.spottype;
  }
  if(initiatorId!=undefined)
  initiatoridVar=initiatorId;
  Circle.findOne({ where: { id: req.body.id} }).then(function (circleFound)
{
  if (circleFound==null)
  Circle.create(
    {//data
      theme, description, isFlexible: isflexibleVar, timeofday: timeofdayVar, invitationOnly, numberOfPeople,
      openToAnyone, keywords: keywordsVar, location: locationVar,
      status, initiatoridVar, date: dateVar, endDate: endDateVar,
      placename: placenameVar, spotType: spottypeVar, 
    }).then(a => { 
     //here req.body.image
     /*
      if (filename!="")
      {
      ImageEntity.create({
        path: filename, entityId: a.id, entityType: "Circle"}). then( a => {console.log("created file")});
      };*/
      
      
      if (req.body.image!=null){
        var filename = Global.createFile(req.body.image,req.body.theme + "-" + req.body.description,"circles");
      if (filename!=null && filename!=undefined){
      Global.createImageEntity("Circle", filename, a.id);
      }
    }
      console.log('success');
      res.json(a.id);
    })
    .catch(err => console.log(err));
  });
};


// // Search for gigs
// router.get('/search', (req, res) => {
//   let { term } = req.query;

//   // Make lowercase
//   term = term.toLowerCase();

//   Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
//     .then(gigs => res.render('gigs', { gigs }))
//     .catch(err => console.log(err));
// });
