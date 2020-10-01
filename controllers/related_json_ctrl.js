const User = require('../models/User');
const Circle = require('../models/Circle');
const Meet = require('../models/Meeting');
//require from orient a number of related entities; response will contain fields:  circles:[circleids], meets:[meetids]
exports.getRelated = function (req, res) {
    let id = Number(req.params.id);
    let inEntType = String(req.params.inenttype);// possible values: circ/meet/user
    let outEntType = String(req.query.outenttype);

};

module.exports.add = function (req, res) {
    let id = Number(req.params.id);
    let inEntType = String(req.query.inenttype);


    return this.getRelated(id);
};