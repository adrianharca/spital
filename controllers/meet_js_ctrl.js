
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
    let { theme, description, keywords, privacy, numberOfPeople,
        status, initiatorId, when, where } = req.body;
    console.log('request for to create meeting ' + theme + ' ' + description);

    var isflexibleVar = null;
    var dateVar = null;
    var endDateVar = null;
    var keywordsVar = null;
    var timeofdayVar = null;
    var locationVar = null;
    var placenameVar = null;
    var spottypeVar = null;
    var initiatoridVar = null;
    if (when != undefined) {

        isflexibleVar = when.isFlexible;
        timeofdayVar = when.timeOfDay;
        dateVar = Date.parse(when.date);
        endDateVar = null;
        if (when.endDate != null)
            endDateVar = Date.parse(when.endDate);
    }
    if (keywords != undefined) {
        keywordsVar = keywords.toString();
    }

    if (where != undefined) {
        locationVar = where.location;
        placenameVar = where.placeName;
        spottypeVar = where.spotType;
    }
    if (initiatorId != undefined)
        initiatoridVar = initiatorId;
    Meeting.create({//data
        theme, description, isFlexible: isflexibleVar, timeofday: timeofdayVar, numberOfPeople,
        privacy, keywords: keywordsVar, location: locationVar,
        status, initiatoridVar, date: dateVar, endDate: endDateVar,
        placename: placenameVar, spotType: spottypeVar,
    }).then(a => {
        console.log('success');
        res.json(a.id);
    })
        .catch(err => console.log(err));


};

module.exports.updateMeet = (req, res) => { };
module.exports.deleteMeet = (req, res) => { };

