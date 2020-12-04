var Place = require("../models/Place");


var placeConstructor = (latitudeVar, longitudeVar) => {
    var place = {};
    place.latitude = latitudeVar;
    place.longitude = longitudeVar;
    console.log(place.latitude + " " + place.longitude);
    return place;
};


function renderPlace(p){
    var container = new Object();
    const fields = ['id', 'placeName', 'address','createdAt', 'updatedAt', 'deletedAt', 'location'];
    // if(p != null){
        fields.forEach((item, k) => {
            console.log(item, ' ', p[item]);
            container[item] = p[item];
        });
        return container;
        // if(p.location != null){
        //     locationArray = p.location
        //     container.location = [];
        //     locationArray.forEach(
        //         a => {
        //             if (a != null) {
        //                 container.location.push(placeConstructor(a['latitude'], a['longitude']));
        //             }
        //             });          

        // }
    // }
}

module.exports.createPlace = function (req, res) {
    let { placeName, location, address } = req.body;
    var whereConstr = {};
    console.log(req.body);
    whereConstr.placeName = placeName;
    whereConstr.address = address;

    place = Place.findOne({ where: { placeName: placeName } })

        .then(function (c) {
            //res.setHeader('Content-Type', 'application/json');
            console.log('Place found ');



            if (c != null) {
                res.json(c.id);
                console.log(c.id);
                console.log(c.location);
            }
            else
                if (location != undefined) {
                    locationArray = location;
                    whereConstr.location = [];
                    if (Array.isArray(locationArray)) {
                        locationArray.forEach(
                            a => {


                                if (a != null) {
                                    whereConstr.location.push(placeConstructor(a['latitude'], a['longitude']));
                                }
                            });
                    }
                    else {
                        whereConstr.location = new Array(placeConstructor(locationArray[0].latitude, locationArray[0].longitude));
                    }
                    // return whereConstr;
                    Place.create({ placeName: whereConstr.placeName, location: whereConstr.location, address: whereConstr.address })
                        .then(a => {
                            console.log('created place ' + a.placename + ' ' + a.id);
                            res.json(a.id);
                        })
                        .catch(err => console.log(err));
                }

        }).error(function (err) {
            console.log("Error:" + err);
        });

};

module.exports.getPlaceById = function (req, res) {
    var ids = Number(req.body.id);

    place = Place.findOne({ where : {id: ids}})
                    .then(function (p) {
                        res.setHeader('Content-Type', 'application/json');
                        console.log('Place found ');
                        var container = renderPlace(p);
                        console.log(container);
                        res.json({ container });
                    }).error(function(err) {
                        console.error("Error: " + err );
                    });
};

module.exports.getAll = function (req, res) {
    console.log('performing fetch all places');
  
    
    res.removeHeader;
    var result = [];
    Place.findAll()
      .map(renderPlace)
      .then(
        c => {
          res.contentType('application/json');
          res.json(c);
          console.log('result: ' + c + ' ');
        })
  
      .catch(err => console.log(err));
  };

