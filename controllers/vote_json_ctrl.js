var Vote = require("../models/Vote");
var newWhere = require("../models/Where").Where;
var newWhen = require("../models/When").When;

function renderVote(v) {
  var container = new Object();
  // Object.assign(container, c); is di proper way to clone objs in js
  const fields = ['id', 'memberId', 'meetingId', 'numberofpeople',
    'createdAt', 'updatedAt', 'deletedAt'];
  fields.forEach((item, k) => {
    console.log(item, ' ', v[item]);
    container[item] = v[item];
  });
  container.when = new newWhen(v);
  if (v.location != null) {
    container.where = new newWhere(v);
  }
  return container;
}
exports.getAll = function (req, res) {
  console.log('performing fetch all votes');

  res.contentType('application/json');
  res.removeHeader;
  var result = [];
  Vote.findAll()
    .map(l => {
      return renderVote(l);
    })
    .then(
      c => {

        res.json(c)

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
  console.log("add vote: "  +JSON.stringify(req.body));
  let { memberId, meetingId, numberofpeople, placename, spotType, location,
    createdAt, when } = req.body;
  var wenvar = new newWhen(req.body.when);
  var werr = {
    'placename': req.body.where.placeName,
    'spotType': req.body.where.spotType,
    'location': req.body.where.location
  };
  var wervar = new newWhere(werr);

  Vote.create({
    memberId, meetingId, numberofpeople: req.body.numberOfPeople, date: req.body.when.date, endDate: req.body.when.endDate,
    placename: req.body.where.placeName, location: req.body.where.location, timeofday: req.body.when.timeOfDay, createdAt
  }).then(
    a => {
      console.log("vote: " + JSON.stringify(a));
      res.json(a.id)
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