var locUtils = require('geolocation-utils');

//this function may take into consideration other place features besides location, 
//such as binary flags on a Where ( eg non smoking, handicap access etc)
module.exports.spaceDistance = function calculateDistance(w1, w2) {

  l1 = locUtils.createLocation(w1['latitude'], w1['longitude']);
  l2 = locUtils.createLocation(w2['latitude'], w2['longitude']);
  return locUtils.distanceTo(l1, l2);

};


function Where(placename, spottype, location) {
  this.placename = placename;
  this.spottype = spottype;
  this.location = [];
  locationArray = JSON.parse(location);
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