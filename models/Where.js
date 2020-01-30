function Where(placename, spottype, location) {
    this.placename = placename;
    this.spottype = spottype;
    this.location = [];
    if (Array.isArray(location)) {
      location.forEach(
        a => {
          if (a != null)
  
            this.location.push(new Place(a['latitude'], a['longitude']));
        });
    }
    else this.location = new Array(new Place(location['latitude'], location['longitude']));
  };


  function Place(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  };
  module.exports=Where;