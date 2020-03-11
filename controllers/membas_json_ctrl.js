var Circle = require("../models/Circle");
var Member = require("../models/Member");
var Meeting = require("../models/Meeting");
var Global = require("../functions.js");
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

exports.getAllMembersByCircle = (req, res) => {
    cId = Number(req.params.id);/*
    membas = Circle.findByPk(circleId).then(c =>{
       if (c!=null){
       t =c.getMembers().map(renderMember);
       }
       else
       {
           res.json([{}]);
       }
    })
        .then(mbs => {
            if (mbs!=null){
            res.contentType('application/json');
            res.json( mbs );
            console.log('members for circle ' + circleId + ' ');
            }
            else{
                res.json([]);
            }
        } ).catch(e => console.log(e));
        */
    Member.findAll({ where: { circleId: cId } }).
        map(renderMember).
        then(member => {

            res.contentType('application/json');
            if (member != null) {
                res.json(member);
                console.log('result: ' + JSON.stringify(member) + ' ');
            }
            else {
                res.json([]);
            }
        })
        .catch(err => console.log(err));
};
module.exports.getAllMembersByMeetId = (req, res) => {

    id = Number(req.params.id);
    Member.findAll({ where: { meetId: id } }).
        map(renderMember).
        then(member => {

            res.contentType('application/json');
            if (member != null) {
                res.json(member);
                console.log('result: ' + JSON.stringify(member) + ' ');
            }
            else {
                res.json([]);
            }
        })
        .catch(err => console.log(err));
};
exports.getMemberById = (req, res) => {
    if (req.params.id != null) {
        idS = Number(req.params.id);
        console.log('getbyid: ' + idS);
        memberss = Member.findByPk(idS)

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
    }
    else {
        memberss = Member.findAll()

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
    }
};
/////de refacut mizeria de createmember de mai jos, prea multe cautari in baza, cand o fi mai mult itmp
exports.createMember = (req, res) => {
    // var circId=Number(req.params.circleId);
    var circId = Number(req.body.circleId);
    // if(circId==null) this.createMeetMember(req,res); in case sync down wont work
    let { circleId, userId, nickname, motivation } = req.body;
    console.log('request for to create member ' + circleId + ' ' + nickname);
    // Circle.findOne(Number(circleId))
    Circle.findOne({ where: { id: circleId } })
        .then(c => {
            if (c != null) {
                console.log("found circle with id " + circleId + " for member " + nickname);
                Member.findOne({ where: { circleId: circleId, userId: userId } }).then(m1 => {
                    if (m1 == null) {

                        console.log("creating member for circleId= " + circleId + " for nickname " + nickname + " " + userId);
                        c.addMember(Member.
                            create({
                                circleId, userId, nickname, motivation
                            }))
                            .catch(console.log)
                            .then(a => {
                                Member.findOne({ where: { circleId: circleId, userId: userId } }).then
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
                        console.log("found already member existing for circleId= " + circleId + " for member " + nickname);
                        res.json(m1.id);
                    }
                });

            }
            else {
                console.log("found not circle with id " + circleId);
            };
        }
        )
        .catch(err => console.log(err));


};
exports.createMeetMember = (req, res) => {
    // var circId=Number(req.params.circleId);
    console.log('request create meetMember');
    var meetId = Number(req.body.meetId);
    let { circleId, userId, nickname, motivation } = req.body;
    console.log('request for to create meet member ' + meetId + ' ' + nickname);
    // Circle.findOne(Number(circleId))
    Meeting.findOne({ where: { id: meetId } })
        .then(c => {
            if (c != null) {
                console.log("found meet with id " + meetId + " for member " + nickname);
                Member.findOne({ where: { meetId: meetId, userId: userId } }).then(m1 => {
                    if (m1 == null) {

                        console.log("creating member for meetId= " + meetId + " for nickname " + nickname + " " + userId);
                        Member.
                            create({
                                meetId, circleId, userId, nickname, motivation
                            })
                            // .catch(console.log)
                            .then(a => {
                                console.log('success created memba ' + JSON.stringify(a) + " -- ");
                                res.json(a.id);
                                c.addMember(a);
                                // Member.findOne({ where: { meetId: meetId, userId: userId } }).then
                                //     (c1 => {
                                //         if (c1 != null) {
                                //             console.log('success created memba ' + JSON.stringify(a) + " -- ");
                                //             res.json(c1.id);
                                //         }
                                //         else {

                                //         }
                                //     })
                            })
                            .catch(console.log);
                    }
                    else {
                        console.log("found already member existing for meeting= " + meetId + " for member " + nickname);
                        res.json(m1.id);
                    }
                });

            }
            else {
                console.log("found not circle with id " + circleId);
            };
        }
        )
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