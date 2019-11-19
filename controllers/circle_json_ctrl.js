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

function renderCircle(c) {
  var container = new Object();
  // Object.assign(container, c); is di proper way to clone objs in js
  const fields = ['id', 'theme', 'description', 'status',
    'initiatorid', 'image', ' invitationOnly', 'openToAnyone',
    'createdAt', 'updatedAt', 'deletedAt'];
  fields.forEach((item,k)=>{
    console.log(item, ' ',k,' ',c[item]);
    container[item]=c[item];
  })
  container.keywords = [];
  container.keywords = c.keywords.split(",");
  // container.creationDate = new Date(circleFound.creationDate);

  if (c.date != undefined) {
    var when = {};
    when.date =new Date(c.date,);
    when.endDate = new Date(c.endDate);
    when.timeofday = c.timeOfDay;
    container.when = when;
  }
  if (c.location != null) {
    var where = {};
    where.location = c.location;
    where.placename = c.placename;
    where.spottype = c.spotType;
    container.where = where;
  }

  //container.image = undefined;
  container.image = c.data;
  return container;
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

    .then(function (c) {
      res.setHeader('Content-Type', 'application/json');
      console.log('Circle found ');
      var container = renderCircle(c);
      // Object.assign(container, c);
      // container.keywords =[];
      // container.keywords= c.keywords.split(",");
      // // container.creationDate = new Date(circleFound.creationDate);
      // container.when={};
      // container.when.date = new Date(c.date);
      // container.when.endDate = new Date(c.endDate);
      // container.when.timeofday= c.timeOfDay;

      // container.where={};
      // container.where.location=c.location;
      // container.where.placename=c.placename;
      // container.where.spottype=c.spotType


      // //container.image = undefined;
      // container.image = c.data;
      console.log(container);

      // res.send(container);
      // res.contentType('application/json');
      // res.json(JSON.parse(JSON.stringify(container)));]
      res.json({ container });
    }).error(function (err) {
      console.log("Error:" + err);
    });
}

exports.downloadImageById = function (req, res) {

  idS = Number(req.params.id);
  console.log('getbyid' + idS);
  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "circles";
  var pathC = require("path");
  var shell = require('shelljs');

  circless = Circle.findOne({ where: { id: idS } }).then(function (circleFound) {

    if (circleFound != null) {
      var file = fs.readFileSync(pathC.resolve(circleFound.image), 'binary');
      res.setHeader('Content-Length', file.length);
      res.write(file, 'binary');
      res.end();
    }
    else {
      res.send("null");
    }
  }).error(function (err) {
    console.log("Error:" + "no image found");
    res.send(err);
  });
}

exports.getAll = function (req, res) {
  console.log('performing fetch all');

  res.removeHeader;
  var result = [];
  Circle.findAll()
    .map(l => {
      // var container = {};
      // container = l;
      // var keywords = [];
      // keywords = l.keywords;
      // container.keywords = keywords.split(",");
      // // container.json(container.keywords);
      // container.creationDate = new Date(l.creationDate);
      // container.date = new Date(l.date);
      // //container.image = undefined;
      // container.image = l.data;
      // container.endDate = new Date(l.endDate);
      // return container;
      return renderCircle(l);
    })
    .then(
      c => {
        res.contentType('application/json');
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
      res.sendFile(pathC.resolve(circleFound.image));
    }
    else {
      res.send("null");
    }
  }).error(function (err) {
    console.log("Error:" + "no image found");
    res.send(err);
  });
}


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
  let { theme, description, keywords, invitationOnly, numberOfPeople, openToAnyone,
    status, initiatorid, when, where } = req.body;
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
    timeofdayVar = when.timeOfDay;
    dateVar = Date.parse(when.date);
    if (!isNaN(when.endDate) && !isNaN(Date.parse(when.endDate)))
      endDateVar = Date.parse(when.endDate);
    // creationDateVar = Date.parse(creationDate);
  }
  if (keywords != undefined) {
    keywordsVar = keywords.toString();
  }

  if (where != undefined) {

    locationVar = where.location;
    placenameVar = where.placename;
    spottypeVar = where.spottype;
  }
  Circle.create(
    {//data
      theme, description, isFlexible: isflexibleVar, timeofday: timeofdayVar, invitationOnly, numberOfPeople,
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
