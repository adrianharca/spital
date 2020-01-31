var When = require('../models/When');
var Where = require('../models/Where');

//this function can extend to include such things as user preferences,
// other members' preferences 
function Participrobability(distanceByLocation, distanceByTime, distanceByCrowding) {
    this.locDistance = 1 / distanceByLocation;// remove one after implementing normalization in responsible fcts
    this.timeDistance = distanceByTime;
    this.crowdDistance = 1 / distanceByCrowding;
};

//this needs to look at the options of others
function calcCrowdDist(v, p) {
    return 1;
};

const calculateDistance = (vote, preferences) => {
    var ret;
    if (Array.isArray(preferences)) {
        ret = [];
        preferences.forEach(
            p => ret.push(
                calculateDistance(vote, p)));
    }
    else
        ret = new Participrobability(
            When.distanceByTime(vote, preferences),
            Where.spaceDistance(vote, preferences),
            calcCrowdDist(vote, preferences));
    return ret;
};