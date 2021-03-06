var Interest = require("../models/Interest");
var InterestCategory  = require("../models/InterestCategory");


var Global = require("../functions.js");
console.log("interest_json_ctrl");


exports.delete = function (req, res) {
    console.log('deleted');
  };


  

  exports.getAllJSON = function (req, res) {
    console.log('performing fetch all keywords');

  
    var result = [];
    Interest.findAll({
    
      order: [
          ['interestName', 'ASC'],
      ]
  }).then(c => {
    if (Global.isEmpty(c)){
      res.json(JSON.parse("[{\"id\": 90,\"interestName\": \"Kusturica\",\"categoryId\": 1,\"createdAt\": \"2020-09-18 11:16:57\",\"updatedAt\": \"2020-09-18 11:16:57\",\"deletedAt\": null}]"));
    }
    else{
      res.contentType('application/json');
      res.json(c);
    }

   }); 
  }
  exports.getAll = function (req, res) {
    console.log('performing fetch all keywords');

  
    var result = [];
    Interest.findAll({
    
      order: [
          ['interestName', 'ASC'],
      ]
  }).then(c => res.render('interests', { c })) ; 
    /*
    Interest.findAll({
    
      order: [
          ['interestName', 'ASC'],
      ]
  })
      .map(l => {
        return l;
      })
      .then(
        c => {
          res.contentType('application/json');
          res.json(c);
  
          console.log('result: ' + result + ' ');
        })
  
      .catch(err => console.log(err));
      */
  };
 

   exports.addOne = function (req, res) {
 
    let { interestName, categoryId } = req.body;
    Interest.findOne({ where: { interestName: req.body.interestName } }).then(function (categoryFound) {
      if (categoryFound == null)
      {
        Interest.create(
          {
            interestName, categoryId
          }).then(a => {
           
            console.log('had success:' + categoryFound + "-" + JSON.stringify(req.body));
            res.json(a.id);
          })
          .catch(err => console.log(err));
        }
       // else
       // res.json('The interest was already created');
    });
  };
  