const User = require('../models/User');

console.log("user_json_ctrl");

exports.getAllUsers =function(req,res){
     User.findAll()
.map(l=> {container={};
  container=l;
  container.interests = l.interests.split(",");
  return container;})
  .then(
    c => {
  
    res.json({c});
  
    console.log('result: ' + c + ' ');
  })

  .catch(err => console.log(err));
}
exports.delete= function(req,res){
    console.log('deleted');
  }

  exports.getUserById= function(req,res){
 
    idS = Number(req.params.id);
    console.log('getbyid: -' +idS);
    user = User.findOne({where: {id: idS}}).then(function (userFound) {
        container={};
        container=userFound;
        container.interests=userFound.interests.split(",");
        res.send(container);
    
    }).error(function (err) {
        console.log("Error:" + err);
    });
    }
    exports.getUserByEmail= function(req,res){
 
        emailS = req.params.email;
        console.log('getbyemail: ' +emailS);
        user = User.findOne({where: {email: emailS}}).then(function (userFound) {
            container={};
            container=userFound;
            container.interests=userFound.interests.split(",");
            res.send(container);
        
        }).error(function (err) {
            console.log("Error:" + err);
        });
        }
        exports.getUserByName= function(req,res){
 
            nameS = req.params.name;
            console.log('getbyname: ' +nameS);
            user = User.findOne({where: {name: nameS}}).then(function (userFound) {
                container={};
                container=userFound;
                container.interests=userFound.interests.split(",");
                res.send(container);
            
            }).error(function (err) {
                console.log("Error:" + err);
            });
            }
exports.createUser = function (req, res) {
    console.log(req.body);
    let { name, firstname, lastname, email, acctype,
        bday, pass, description, interests,
        trustscore, img, gender } = req.body;
    let errors = [];
    if (errors.length > 0) {
        res.put('err', {
            errors
        });
    } else {-
        User.create({
            name, firstname, lastname, email, acctype,
            bday, pass, description, interests : interests.toString(),
            trustscore, img, gender
        }).then(a => {
            console.log('added user' + a.id);
            res.json(a.id);
        }).catch(err => console.log(err));

    }
}