var Vote = require("../models/Vote");
var newWhere = require("../models/Where");
var newWhen = require("../models/When");

function renderVote(v) {
  var container = new Object();
  // Object.assign(container, c); is di proper way to clone objs in js
  const fields = ['id', 'memberId', 'circleId', 'numberofpeople',
    'createdAt', 'updatedAt', 'deletedAt'];
  fields.forEach((item, k) => {
    console.log(item, ' ', c[item]);
    container[item] = c[item];
  });
  container.when = new newWhen(v);
  if (c.location != null) {
    container.where = new newWhere(c.placename, c.spotType, c.location);
  }
}
exports.getAll=function (req, res)  {
  console.log('performing fetch all votes');

  res.contentType('application/json');
  res.removeHeader;
  var result=[];
  Vote.findAll()
  .map(l => {
    return renderVote(l);
  })
    .then(
      c => {
        
       res.json({c})
    
      console.log('result: ' + result + ' ');
    })
  
    .catch(err => console.log(err));
};
exports.getVotesByMemberId = function (req, res) {
  console.log('performing fetch all votes ');
  res.removeHeader;
  var result = [];
  idS = Number(req.params.id);

  Vote.findAll({ where: { memberId: idS } }).
    map(renderVote).
    then(c => {
      res.contentType('application/json');
      res.json(c);

      console.log('result: ' + result + ' ');
    })

    .catch(err => console.log(err));
};

exports.addVote = function (req, res) {
  console.log(JSON.stringify(req.body));
  let {  memberId, circleId, numberofpeople,
    createdAt,  when, where } = req.body;
  var wenvar = newWhen(req.body.when);
  var wervar = newWhere(req.body.where.placename, req.body.where.spotType, req.body.where.location);

  Vote.create({
    memberId, circleId, numberofpeople: req.body.numberOfPeople, date: req.body.when.date, endDate: req.body.when.endDate,
     placename: req.body.where.placeName, location: req.body.where.location, timeofday: req.body.when.timeOfDay, createdAt
  }).then(
    a => {
      console.log("vote: " + JSON.stringify(a));
      res.json(a.id)}
  )
    .catch(err => console.log(err));

};
exports.deleteVoteByid = function (req, res) {
  idS = Number(req.params.id);
  console.log('Received request to delete vote with id:' + idS);
  Vote.destroy({ where: { id: idS } })
    .then(
      c => {
        res.contentType('application/json');
        res.json(idS);
        console.log('deleted: ' + idS + ' output:' + c);
      }
    )
    .catch(
      err => console.log(err)
    );

};