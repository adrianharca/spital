
var Meeting = require("../models/Meeting");
var When = require('../models/When').When;
var Where = require('../models/Where').whereConstructor;

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
        if (c.location != null) {
            container.where = new Where(c.placename, c.spotType, c.location);
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
module.exports.addMeet = (req, res) => { };
module.exports.updateMeet = (req, res) => { };
module.exports.deleteMeet = (req, res) => { };

