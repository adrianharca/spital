const User = require('../models/User');
const Circle = require('../models/Circle');
const Meet = require('../models/Meeting');
const types = require('../computation/nlp/similaritindex.js').types;
const Indata = require('../computation/nlp/similaritindex.js').datawrap;
const addToGraph = require('../computation/nlp/similaritindex.js').addone;
const getSimilar = require('../computation/nlp/similaritindex.js').getRelated;


//require from orient a number of related entities; response will contain fields:  circs:[circleids], meets:[meetids]
exports.getRelated = function (req, res) {
    let id = Number(req.params.id);
    let inEntType = String(req.params.inenttype);// possible values: circ/meet/user, use types constant
    let outEntType = String(req.query.outenttype);// possible values: circ/meet
    return res.json(getSimilar(id, inEntType));
};

exports.add = async function (req, res, next) {
    let id = Number(req.params.id);
    let inEntType = String(req.query.inenttype);
    let keywords = Array.from(req.query.keywords);
    let arg = new Indata(inEntType, id, keywords);//types[inEntType] != undefined ? types[inEntType] : getKeyByValue(types, inEntType)
    await addToGraph(arg).catch(console.log);
    next();

};