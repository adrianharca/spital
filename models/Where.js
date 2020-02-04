var locUtils = require('geolocation-utils');

//this function spits out distance in ms between 2 Wheres
//             may take into consideration other place features besides location, 
//                such as binary flags on a Where ( eg non smoking, handicap access etc)
module.exports.spaceDistance = function calculateDistance(w1, w2) {

  var loca1 = w1.location;
  var loca2 = w2.location;

  var l1 = locUtils.createLocation(loca1[0].latitude, loca1[0].longitude);
  var l2 = locUtils.createLocation(loca2[0].latitude, loca2[0].longitude);
  //treat area
  var l1IsArea = isArea(loca1);
  var l2IsArea = isArea(loca2);

  if (l1IsArea) {
    var l12 = locUtils.createLocation(loca1[1].latitude, loca1[1].longitude);
    var rad1 = locUtils.distanceTo(l1, l12);
    if (!l2IsArea) {
      if (locUtils.insideCircle(l2, l1, rad1))
        return 1;
      return distanceTo(l1, l2) - rad1;// distance to circle
    }
  }
  if (l2IsArea) {
    var l22 = locUtils.createLocation(loca2[1].latitude, loca2[1].longitude);
    var rad2 = locUtils.distanceTo(l2, l22);
    if (!l1IsArea) {
      if (locUtils.insideCircle(l1, l2, rad2))
        return 1;
      return distanceTo(l1, l2) - rad2;// distance to circle
    }
  }
  //get an avg of dists from edge of area to other center
  if (l1IsArea && l2IsArea)
    return locUtils.distanceTo(l1, l2) - ((rad1 + rad2) / 2);
  //if they r both points compute distance
  return locUtils.distanceTo(l1, l2);

};
module.exports.isArea = function isArea(locationArray) {
  return locationArray.length > 1;
};
//so apparently there is no overloading fcts in js
// function Where(placename, spottype, location) {
//   this.placename = placename;
//   this.spottype = spottype;
//   this.location = [];
//   var locationArray = JSON.parse(location);
//   if (Array.isArray(locationArray)) {
//     locationArray.forEach(
//       a => {
//         if (a != null)

//           this.location.push(new Place(a['latitude'], a['longitude']));
//       });
//   }
//   else {
//     //why is locationArray treated as an array outside the if?
//     this.location = new Array(new Place(locationArray[0].latitude, locationArray[0].longitude));
//   }
// };
function Where(vote) {
  this.placename = vote.placename;
  this.spottype = vote.spottype;
  this.location = [];
  var locationArray = JSON.parse(vote.location);
  if (Array.isArray(locationArray)) {
    locationArray.forEach(
      a => {
        if (a != null)

          this.location.push(new Place(a['latitude'], a['longitude']));
      });
  }
  else {
    //why is locationArray treated as an array outside the if?
    this.location = new Array(new Place(locationArray[0].latitude, locationArray[0].longitude));
  }
};

function Place(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
};



module.exports.Where = Where;