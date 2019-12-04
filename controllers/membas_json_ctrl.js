var Circle = require("../models/Circle");
var Member = require("../models/Member");

function renderMember(m) {
    var holder = new Object();
    const fields = ['id',
        'circleId',
        'age',
        'userId',
        'nickname',
        'motivation',
        'image',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'initiatorid'];
    // Object.values(m).forEach(i => holder[i] = m[i]);
    fields.forEach((item, k) => {
        console.log(item, ' ', k, ' ', m[item]);
        holder[item] = m[item];
      });
    return holder;

}

exports.getAllMembersByCircle = (req, res) => {
    circleId = Number(req.params.id);
    membas = Circle.findByPk(circleId).then(c =>
       c.getMembers().map(renderMember) )
        .then(mbs => {
            res.contentType('application/json');
            res.json({ mbs });
            console.log('members for circle ' + circleId + ' ' + res);
        }).catch(e => console.log(e));

};

exports.getMemberById = (req, res) => {
    idS = Number(req.params.id);
    console.log('getbyid' + idS);
    circless = Member.findByPk(idS)

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
    Circle.findByPk(circleId)
   // Circle.findOne({ where: { id: circleId } })
    .then(c =>
        c.addMember(Member.
            create({
                circleId, userId, nickname, motivation
            }))
            .catch(console.log)
            .then(a => {
                console.log('success created memba ' + a);
                res.json(a.id);
            })
            .catch(console.log))
        .catch(err => console.log(err));

};
exports.updateMember = (req, res) => {
    idS = Number(req.params.id);
    let { circleId, userId, nickname, motivation } = req.body;
    Member.findOne({ where: { id: Number(idS) } }.update({
        circleId, userId, nickname, motivation
    })).then(a => {
        console.log('success');
        res.send(a.id);
    }).catch(err => console.log(err));

};
exports.deleteMember = (req, res) => {
    console.log('deletion is happening');
};