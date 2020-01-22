var Vote = require("../models/Vote");

var newWhere = require("./circle_json_ctrl").newWhere;
var newWhen = require("./circle_json_ctrl").newWhen;

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
  let {  memberId, circleId, numberofpeople,
    createdAt,  when, where } = req.body;
  var wenvar = newWhen(when);
  var wervar = newWhere(where.placename, where.spotType, where.location);

  Vote.create({
    memberId, circleId, numberofpeople,
     when: wenvar, where: wervar, createdAt
  }).then(
    a => res.json(a.id)
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