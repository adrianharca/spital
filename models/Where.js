var locUtils = require('geolocation-utils');
module.exports.isArea = function isArea(locationArray) {
  return locationArray.length > 1;
};
//this function spits out distance in ms between 2 Wheres
//             may take into consideration other place features besides location, 
//                such as binary flags on a Where ( eg non smoking, handicap access etc)
module.exports.spaceDistance = function calculateDistance(w1, w2) {
  if (w1['location'] != undefined) {//params are votes
    var loca1 = new Object; Object.assign(loca1, w1.location);
    var loca2 = new Object; Object.assign(loca2, w2.location);


    var l1 = locUtils.createLocation(
      loca1.isArray ? loca1[0].latitude : loca1.latitude,
      loca1.isArray ? loca1[0].longitude : loca1.longitude, 'LatitudeLongitude');
    var l2 = locUtils.createLocation(
      loca2.isArray ? loca2[0].latitude : loca2.latitude,
      loca2.isArray ? loca2[0].longitude : loca2.longitude, 'LatitudeLongitude');
    //treat area
    var l1IsArea = this.isArea(loca1);
    var l2IsArea = this.isArea(loca2);

    if (l1IsArea) {
      var l12 = locUtils.createLocation(loca1[1].latitude, loca1[1].longitude, 'LatitudeLongitude');
      var rad1 = locUtils.distanceTo(l1, l12);
      if (!l2IsArea) {
        if (locUtils.insideCircle(l2, l1, rad1))
          return 1;
        return distanceTo(l1, l2) - rad1;// distance to circle
      }
    }
    if (l2IsArea) {
      var l22 = locUtils.createLocation(loca2[1].latitude, loca2[1].longitude, 'LatitudeLongitude');
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
    return Math.abs(locUtils.distanceTo(l1, l2));
  }
  else {//params are location data
    // varl1 = locUtils.toLatitudeLongitude({ lat: w1.latitude, lon: w1.longitude });
    // varl2 = locUtils.toLatitudeLongitude({ lat: w2.latitude, lon: w2.longitude });


    var l1 = locUtils.createLocation(w1.latitude, w1.longitude, 'LatitudeLongitude');
    var l2 = locUtils.createLocation(w2.latitude, w2.longitude, 'LatitudeLongitude');
    return Math.abs(locUtils.distanceTo(l1, l2));
  }

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
  if (vote != null) {

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
  }
};

function Place(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
};



module.exports.Where = Where;