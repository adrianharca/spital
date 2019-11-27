var Circle = require("../models/Circle");
var Member = require("../models/Member");



exports.getAllMembersByCircle = (req, res) => {
    circleId = Number(req.params.id);
    membas = Circle.findByPk(circleId).then(c=>
        
            c.getMembers()
        
        ).error(console.log).
        then(mbs => {container=[]
            k=0;
            mbs.array.forEach(element => {
                console.log(element);
                k++;
          container[k]=[JSON.parse(element)];
        });
        res.contentType('application/json');
            res.json({ container });
            console.log('members for circle ' + circleId + ' ' + res);
        }).error(e=>res.send(e));

};

exports.getMemberById = (req, res) => {
    idS = Number(req.params.id);
    console.log('getbyid' + idS);
    circless = Member.findByPk( idS)

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