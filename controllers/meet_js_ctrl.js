
var Meeting = require("../models/Meeting");
var When = require('../models/When').When;
var Where = require('../models/Where').whereConstructor;
var Circle = require("../models/Circle");

function renderMeeting(c) {
    var container = new Object();
    // Object.assign(container, c); is di proper way to clone objs in js
    const fields = ['id', 'theme', 'description', 'status',
        'initiatorid', 'image', 'privacy', 'minCrowd', 'maxCrowd',
        'createdAt', 'updatedAt', 'deletedAt'];
    if (c != null) {
        fields.forEach((item, k) => {
            console.log(item, ' ', c[item]);
            container[item] = c[item];
        });
        container.keywords = [];
        container.keywords = c.keywords == null ? [] : c.keywords.split(",");

        if (c.date != undefined) {
            container.when = new When(c);
        }
        // if (c.location != null) {
        //     container.where = new Where(c.placename, c.spotType, c.location);
        // }
        if (c.placeId != null) {
            //retrieve place from db and send it
        }
        //TODO: render  'circleId', 'parentId'

        // if(c.circleId!=null){
        //     c.getParent
        // }


        return container;
    }
    else {
        return {};
    }
};
module.exports.getMeetsForCircle = (req, res) => {
    var idS = req.body.circleId;
    console.log('fetching meetings for circle');
    Meeting.findAll({ where: { circleId: idS } }).
        map(renderMeeting).
        then(meet => {

            res.contentType('application/json');
            if (meet != null) {
                res.json(meet);
                console.log('result: ' + JSON.stringify(meet) + ' ');
            }
            else {
                res.json([]);
            }
        })
        .catch(err => console.log(err));

}
module.exports.getMeets = (req, res) => {
    console.log('mmeeting ctrlr' + req.params);
    var result = [];
    Meeting.findAll(
        // {where:{...req.params}} //xperiment
    )
        .map(l => {
            return renderMeeting(l);
        })
        .then(
            c => {
                res.contentType('application/json');
                res.json(c);

                console.log('result: ' + result + ' ');
            })

        .catch(err => console.log(err));

};
exports.getAll = function (req, res) {
    console.log('performing fetch all meetings');
    res.removeHeader;
    var result = [];
    Meeting.findAll()
        .map(l => {
            return renderMeeting(l);
        })
        .then(
            c => {
                res.contentType('application/json');
                res.json(c);

                console.log('result: ' + result + ' ');
            })

        .catch(err => console.log(err));
};
module.exports.addMeet = (req, res) => {
    var circId = Number(req.body.circleId);
    let { circleId, userId, nickname, motivation } = req.body;
    console.log('request for to create member ' + circleId + ' ' + nickname);
    // Circle.findOne(Number(circleId))
    Circle.findOne({ where: { id: circleId } })
        .then(c => {
            if (c != null) {
                console.log("found circle with id " + circleId + " for member " + nickname);
                Meeting.findOne({ where: { circleId: circleId, userId: userId } }).then(m1 => {
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
module.exports.updateMeet = (req, res) => { };
module.exports.deleteMeet = (req, res) => { };

