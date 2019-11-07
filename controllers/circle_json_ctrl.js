 var Circle = require("../models/Circle");
//var router= require('../server')

console.log("circle_json_ctrl");

exports.demoadd=function(req,res){
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


exports.addByThemeDescriptionAndInit=function(req,res){
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
    res.render('add', {
      errors,
      theme, description, initiatorid
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
exports.delete= function(req,res){
  console.log('deleted');
}
exports.getByid= function(req,res){
 
  idS = Number(req.params.id);
  console.log('getbyid' +idS);
  circless = Circle.findAll({where: {id: idS}}).then(function (circleFound) {
    res.send(circleFound);

}).error(function (err) {
    console.log("Error:" + err);
});
}


exports.getAll=function(req,res){
  console.log('performing fetch all');
  res.contentType('application/json');
  res.removeHeader;
  var result=[];
  Circle.findAll()
  .map(l=> {container={};
    container=l;
    container.keywords=l.keywords.split(",");
    container.creationDate = new Date(l.creationDate);
    container.date = new Date(l.date);
    //container.image = undefined;
    container.image = l.data;
    container.endDate = new Date(l.endDate);
    return container;})
    .then(
      c => {
    
      res.json({c});
    
      console.log('result: ' + result + ' ');
    })
  
    .catch(err => console.log(err));
}
exports.updatebyId=function (req, res) {
    console.log("update by Id");
    Circle.update(
      {image: req.body.image},
        {where: {id: req.body.id}}
    )
    .then(function() {
      console.log("Project with id " + req.body.id + " updated successfully!");
  
  }).catch(function(e) {
    
    console.log("Project update failed ! " + e);
      res.send(e);
  })
  res.send();
   };
    
exports.deleteByid=function(req,res){
  console.log('delbyid');
}
exports.addOne= function(req,res){
  console.log('adding one '+ req);
  let {theme, description,keywords, creationDate, invitationOnly, numberOfPeople, openToAnyone,
        status, initiatorid,date, endDate,when, where}=req.body;
        var isflexibleVar = null;
        var dateVar = null;
        var endDateVar = null;
        var creationDateVar = null;
        var keywordsVar = null;
        var timeofdayVar = null;
        var locationVar = null;
        var placenameVar = null;
        var spottypeVar = null;

        if (when!=undefined){
            isflexibleVar = when.isFlexible;
            dateVar = Date.parse(when.date);
            endDateVar = Date.parse(when.endDate);
            creationDateVar = Date.parse(creationDate);
        }
        if (keywords!=undefined){
          keywordsVar = keywords.toString();
        }
        //where is not a thing in the answer. 
        if (where!=undefined){
            timeofdayVar = when.timeOfDay;
            locationVar = where.location;
            placenameVar = where.placename;
            spottypeVar = where.spottype;
        }
  Circle.create(
    {//data
      theme, description, isFlexible: isflexibleVar, timeofday:timeofdayVar, 
      creationDate: creationDateVar, invitationOnly, numberOfPeople, 
      openToAnyone, keywords: keywordsVar, location: locationVar,
      status, initiatorid, date: dateVar, endDate: endDateVar, 
      placename: placenameVar, spotType: spottypeVar
  }) .then(a => {
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
