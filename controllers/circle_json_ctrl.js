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



exports.getAll=function(req,res){
  
  res.contentType('application/json');
  res.removeHeader;
  var result=[];
  Circle.findAll()
    .then(
      c => {
        
      
      //res.send(JSON.stringify(c));
       res.json({c})
    
      console.log('result: ' + result + ' ');
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
  console.log('getbyid');
}
exports.updatebyId=function(req,res){
  console.log('updatebyid');
}
exports.deleteByid=function(req,res){
  console.log('delbyid');
}
exports.addOne= function(req,res){
  let {theme, description,keywords, 
        status, initiatorid,date, enddate, placename}=req.body;
  console.log(req.body);
let str= keywords.join();
  Circle.create(
    {//data
      theme, description, str,
    status, initiatorid,date, enddate, placename
  }) .then(a => {
    console.log('success');
    res.json({a});
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
