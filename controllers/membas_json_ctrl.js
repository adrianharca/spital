var Meeting = require("../models/Circle");
var Member = require("../models/Member");
var Global = require("../functions.js");
function renderMember(m) {
    var holder = new Object();
    const fields = ['id',
        'meetingId',
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
        //  console.log(item, ' ', k, ' ', m[item]);
        holder[item] = m[item];
    });
    return holder;

}

exports.getImageById = function (req, res) {
    idS = Number(req.params.id);
    console.log('getbyid' + idS);
    var mainPath = __dirname + "\\.." + "\\public\\img\\";
    var path = mainPath + "members";
    var pathC = require("path");
    var shell = require('shelljs');
    images = ImageEntity.findOne({ where: { id: idS, entityType: "Member" } }).then(function (imageFound) {
        if (imageFound != null) {
            res.sendFile(pathC.resolve(imageFound.path));
        }
        else {
            res.send("null");
        }
    }).error(function (err) {
        console.log("Error:" + "no image found");
        res.send(err);
    });
};

exports.getAllMembersByMeeting = (req, res) => {
    meetingId = Number(req.params.id);
    membas = Meeting.findByPk(meetingId).then(c => {
        if (c != null)
            c.getMembers().map(renderMember)
    })
        .then(mbs => {
            res.contentType('application/json');
            res.json(mbs);
            console.log('members for meeting ' + meetingId + ' ');
        }).catch(e => console.log(e));

};

exports.getMemberById = (req, res) => {
    if (req.params.id != null) {
        idS = Number(req.params.id);
        console.log('getbyid: ' + idS);
        memberss = Member.findByPk(idS)

            .then(function (mb) {
                container = {};
                container = mb;
                //   container.keywords = meetingFound.keywords.split(",");
                //   container.creationDate = new Date(meetingFound.creationDate);
                //   container.date = new Date(meetingFound.date);
                //   //container.image = undefined;
                //   container.image = meetingFound.data;
                //   container.endDate = new Date(meetingFound.endDate);
                res.send(container);

            }).error(function (err) {
                console.log("Error:" + err);
            });
    }
    else {
        memberss = Member.findAll()

            .then(function (mb) {
                container = {};
                container = mb;
                //   container.keywords = meetingFound.keywords.split(",");
                //   container.creationDate = new Date(meetingFound.creationDate);
                //   container.date = new Date(meetingFound.date);
                //   //container.image = undefined;
                //   container.image = meetingFound.data;
                //   container.endDate = new Date(meetingFound.endDate);
                res.send(container);

            }).error(function (err) {
                console.log("Error:" + err);
            });
    }
};
/////de refacut mizeria de createmember de mai jos, prea multe cautari in baza, cand o fi mai mult itmp
exports.createMember = (req, res) => {
    // var circId=Number(req.params.meetingId);
    var circId = Number(req.body.meetingId);
    let { meetingId, userId, nickname, motivation } = req.body;
    console.log('request for to create member ' + meetingId + ' ' + nickname);
    // Meeting.findOne(Number(meetingId))
    Meeting.findOne({ where: { id: meetingId } })
        .then(c => {
            if (c != null) {
                console.log("found meeting with id " + meetingId + " for member " + nickname);
                Member.findOne({ where: { meetingId: meetingId, userId: userId } }).then(m1 => {
                    if (m1 == null) {

                        console.log("creating member for meetingId= " + meetingId + " for nickname " + nickname + " " + userId);
                        c.addMember(Member.
                            create({
                                meetingId, userId, nickname, motivation
                            }))
                            .catch(console.log)
                            .then(a => {
                                Member.findOne({ where: { meetingId: meetingId, userId: userId } }).then
                                    (c1 => {
                                        if (c1 != null) {
                                            console.log('success created memba ' + JSON.stringify(a) + " -- ");
                                            res.json(c1.id);
                                        }
                                        else {

                                        }
                                    })
                            })
                            .catch(console.log);
                    }
                    else {
                        console.log("found already member existing for meetingId= " + meetingId + " for member " + nickname);
                        res.json(m1.id);
                    }
                });

            }
            else {
                console.log("found not meeting with id " + meetingId);
            };
        }
        )
        .catch(err => console.log(err));


};
exports.updateMember = (req, res) => {
    idS = Number(req.params.id);
    let { meetingId, userId, nickname, motivation } = req.body;
    Member.findOne({ where: { id: Number(idS) } }.update({
        meetingId, userId, nickname, motivation
    })).then(a => {
        console.log('success');
        res.send(a.id);
    }).catch(err => console.log(err));

};
exports.deleteMember = (req, res) => {
    console.log('deletion is happening');
};