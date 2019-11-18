var Circle = require("../models/Circle");
var Member = require("../models/Member");



exports.getAllMembersByCircle = (req, res) => {
    circleId = Number(req.params.circleId);
    membas = Circle.findOne({ where: { id: circleId } }).getMembers().
        then(mbs => {
            res.json({ mbs });
            console.log('members for circle ' + circleId + ' ' + res);
        })

};

exports.getMemberById = (req, res) => {
    idS = Number(req.params.id);
    console.log('getbyid' + idS);
    circless = Member.findOne({ where: { id: idS } })

        .then(function (mb) {
            container = {};
            container = mb;
            //   container.keywords = circleFound.keywords.split(",");
            //   container.creationDate = new Date(circleFound.creationDate);
            //   container.date = new Date(circleFound.date);
            //   //container.image = undefined;
            //   container.image = circleFound.data;
            //   container.endDate = new Date(circleFound.endDate);
            res.send(container);

        }).error(function (err) {
            console.log("Error:" + err);
        });

};
exports.createMember = (req, res) => {
    let { circleId, userId, nickname, motivation } = req.body;
    console.log('request for to create member ' + circleId + ' ' + nickname);
    Circle.findOne({ where: { id: circleId } }).then(c =>
        c.addMember(Member.
            create({
                circleId, userId, nickname, motivation
            }))
         .then(a => {
                console.log('success created memba '+a);
                res.json(a.id);
            }).error(err => console.log(err)))
        .error(err => console.log(err));

};
exports.updateMember = (req, res) => {
    idS = Number(req.params.id);
    let { circleId, userId, nickname, motivation } = req.body;
    Member.findOne({ where: { id: Number(idS) } }.update({
        circleId, userId, nickname, motivation
    })).then(a => {
        console.log('success');
        res.send(a.id);
    }).error(err => console.log(err));

};
exports.deleteMember = (req, res) => {
    console.log('deletion is happening');
};