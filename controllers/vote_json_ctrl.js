var Vote = require("../models/Vote");
var newWhere = require("../models/Where").Where;
var newWhen = require("../models/When").When;
var MemberVote = require("../models/MemberVote");
var db = require("../config/db");

//TODO:add hits on response
function renderVote(v) {
  var container = new Object();
  // Object.assign(container, c); is di proper way to clone objs in js
  const fields = ['id', 'memberId', 'meetId', 'placeId', 'numberofpeople',
    'createdAt', 'updatedAt', 'deletedAt'];
  fields.forEach((item, k) => {
    console.log(item, ' ', v[item]);
    container[item] = v[item];
  });
  container.when = new newWhen(v);
  // if (v.location != null) {
  //   container.where = new newWhere(v);
  // }
  return container;
}

function generateMemberVoteJoinGetAllQuery() {
  return "SELECT circles.vote.*, circles.membervote.meetId, circles.membervote.memberId FROM circles.vote JOIN circles.membervote on circles.vote.id = circles.membervote.voteId"

};

exports.getAll = function (req, res) {
  console.log('performing fetch all votes');

  res.contentType('application/json');
  res.removeHeader();
  var result = [];
  
  db.sequelize.query(
    generateMemberVoteJoinGetAllQuery()
    , { type: db.sequelize.QueryTypes.SELECT }
    ).map(l => {
      return renderVote(l);
    })
    .then(
      c => {

        res.json(c);

        console.log('result: ' + result + ' ');
      })

    .catch(err => console.log(err));
  // Vote.findAll()
  //   .map(l => {
  //     return renderVote(l);
  //   })
  //   .then(
  //     c => {

  //       res.json(c)

  //       console.log('result: ' + result + ' ');
  //     })

  //   .catch(err => console.log(err));
};
exports.getVotesByMemberId = function (req, res) {
  console.log('performing fetch all votes ');
  res.removeHeader();
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
  console.log("add vote: " + JSON.stringify(req.body));
  let { memberId, meetId, circleId, numberofpeople, placeId,
    createdAt, when } = req.body;
  var wenvar = new newWhen(req.body.when);
  // if (req.body.where != undefined) {
  //   var werr = {
  //     'placename': req.body.where.placeName,
  //     'spotType': req.body.where.spotType,
  //     'location': req.body.where.location
  //   };
  //   var wervar = new newWhere(werr);
  // }
  Vote.create({
    memberId, circleId, numberofpeople: req.body.numberOfPeople, date: req.body.when.date, endDate: req.body.when.endDate,
    placeId:placeId, timeofday: req.body.when.timeOfDay, createdAt
  }).then(
    a => {
      console.log("vote: " + JSON.stringify(a));
      MemberVote.create({circleId:circleId, meetId: meetId, memberId: memberId, voteId: a.id})
      .then(a => {
          console.log("created MemberVote: " + a.id)
           res.json(a.voteId);
       })
       .catch(err => console.log(err)); 
    }
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

function generateMemberVoteJoinQuery(meetId) {
  return "SELECT Distinct circles.vote.*, circles.membervote.meetId FROM circles.vote LEFT OUTER JOIN circles.membervote on circles.vote.id = circles.membervote.voteId and circles.membervote.meetId='" + meetId + "'"

};
module.exports.getVotesByMeetId = function (req, res) {
  res.removeHeader();
  var result = [];
  idS = Number(req.params.meetId);
  console.log('performing fetch all votes for meeting ' + idS);

  db.sequelize.query(
    generateMemberVoteJoinQuery(ids)
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


  // MemberVote.findAll({
  //   attributes: [voteId],
  //   where: {meetId : ids}})
  //   .then(function (c){
  //     if(c != null){
  //       Vote.findAll({where: {id: c}})
  //     }
  //   });
  // Vote.findAll({ where: { meetId: idS } }).
  //   map(renderVote).
  //   then(c => {
  //     res.contentType('application/json');
  //     res.json(c);

  //     console.log('result: ' + result + ' ');
  //   })

  //   .catch(err => console.log(err));
// };


