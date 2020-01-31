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
      
      this.location = new Array(new Place(locationArray[0].latitude, locationArray[0].longitude));    
    }
  };


  function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  };
  module.exports=Where;