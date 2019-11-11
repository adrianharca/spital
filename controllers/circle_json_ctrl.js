var Circle = require("../models/Circle");
//var router= require('../server')

console.log("circle_json_ctrl");

exports.demoadd = function (req, res) {
  const data = {
    theme: 'bich',
    description: 'b cray',
    initiatorid: '0',
  }
  let { theme, description, initiatorid } = data;

  Circle.create({
    data
  }).then(a => {
    console.log('created circle ' + theme);
    res.redirect('/circles')
  })
    .catch(err => console.log(err));
}


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
}
exports.delete = function (req, res) {
  console.log('deleted');
}
exports.getCircleByid = function (req, res) {

  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  circless = Circle.findOne({ where: { id: idS } })

    .then(function (circleFound) {
      container = {};
      container = circleFound;
      container.keywords = circleFound.keywords.split(",");
      container.creationDate = new Date(circleFound.creationDate);
      container.date = new Date(circleFound.date);
      //container.image = undefined;
      container.image = circleFound.data;
      container.endDate = new Date(circleFound.endDate);
      res.send(container);

    }).error(function (err) {
      console.log("Error:" + err);
    });
}


exports.getAll = function (req, res) {
  console.log('performing fetch all');
  res.contentType('application/json');
  res.removeHeader;
  var result = [];
  Circle.findAll()
    .map(l => {
      container = {};
      container = l;
      container.keywords = l.keywords.split(",");
      container.creationDate = new Date(l.creationDate);
      container.date = new Date(l.date);
      //container.image = undefined;
      container.image = l.data;
      container.endDate = new Date(l.endDate);
      return container;
    })
    .then(
      c => {

        res.json({ c });

        console.log('result: ' + result + ' ');
      })

    .catch(err => console.log(err));
}
exports.getImageById = function (req, res) {
  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "circles";
  var pathC = require("path");
  var shell = require('shelljs');

  circless = Circle.findOne({ where: { id: idS } }).then(function (circleFound) {
    if (circleFound != null) {
      res.send(circleFound.image);
    }
    else {
      res.send("null");
    }
  }).error(function (err) {
    console.log("Error:" + err);
    res.send(err);
  });
}
exports.getImage = function (req, res) {
  idS = Number(req.params.id);
  console.log("get image");
  circless = Circle.findOne({ where: { id: idS } })

    .then(function (circleFound) {
      container = {};
      container = circleFound;
      var data = container.image;
      res.send(data);

    }).error(function (err) {
      console.log("Error:" + err);
    });
};


exports.updatebyId = function (req, res) {
  console.log("update by Id");

  idS = Number(req.params.id);
  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "circles";
  var pathC = require("path");
  var shell = require('shelljs');

  //not forget to install npm install shelljs
  //npm install buffer
  if (req.body.image != undefined) {
    const fs = require('fs');

    if (!fs.existsSync(path)) {
      shell.mkdir('-p', path);
    }
    var rawImg = req.body.image;
    let buffer = Buffer.from(rawImg);
    var filename = path + "\\" + req.body.theme + "-" + req.body.description + ".jpg";
    fs.writeFile(filename, buffer, 'base64', function (err) { });

    Circle.update(
      { image: filename },
      { where: { id: req.body.id } }

    ).
      then(function () {
      });
    console.log("Project with id " + req.body.id + " updated successfully!");
  }
  res.send("ok");
};


exports.deleteByid = function (req, res) {
  console.log('delbyid');
}
exports.addOne = function (req, res) {
  console.log('adding one ' + req);
  let { theme, description, keywords, creationDate, invitationOnly, numberOfPeople, openToAnyone,
    status, initiatorid, date, endDate, when, where } = req.body;
  var isflexibleVar = null;
  var dateVar = null;
  var endDateVar = null;
  var creationDateVar = null;
  var keywordsVar = null;
  var timeofdayVar = null;
  var locationVar = null;
  var placenameVar = null;
  var spottypeVar = null;

  if (when != undefined) {
    isflexibleVar = when.isFlexible;
    dateVar = Date.parse(when.date);
    if (!isNaN(when.endDate) && !isNaN(Date.parse(when.endDate)))
      endDateVar = Date.parse(when.endDate);
    creationDateVar = Date.parse(creationDate);
  }
  if (keywords != undefined) {
    keywordsVar = keywords.toString();
  }

  if (where != undefined) {
    timeofdayVar = when.timeOfDay;
    locationVar = where.location;
    placenameVar = where.placename;
    spottypeVar = where.spottype;
  }
  Circle.create(
    {//data
      theme, description, isFlexible: isflexibleVar, timeofday: timeofdayVar,
      creationDate: creationDateVar, invitationOnly, numberOfPeople,
      openToAnyone, keywords: keywordsVar, location: locationVar,
      status, initiatorid, date: dateVar, endDate: endDateVar,
      placename: placenameVar, spotType: spottypeVar
    }).then(a => {
      console.log('success');
      res.json(a.id);
    })
    .catch(err => console.log(err));
}


// // Search for gigs
// router.get('/search', (req, res) => {
//   let { term } = req.query;

//   // Make lowercase
//   term = term.toLowerCase();

//   Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
//     .then(gigs => res.render('gigs', { gigs }))
//     .catch(err => console.log(err));
// });
