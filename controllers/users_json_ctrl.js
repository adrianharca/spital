const User = require('../models/User');

console.log("user_json_ctrl");

exports.updateUserById= function(req,res){
   console.log("update user by Id");
   interestsVar = null;
   birthdayVar = null;
   if (req.body.interests!=null)
        interestsVar =  req.body.interests.toString();
   if (req.body.birthday!=null)
        birthdayVar = Date.parse(req.body.birthday);
    User.update(
      {image: req.body.image,
        name: req.body.name,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        acctype: req.body.acctype,
        bday: birthdayVar,
        description: req.body.description,
        interests: interestsVar,
        gender: req.body.gender
        },
        {where: {id: req.body.id}}
    )
    .then(function() {
      console.log("Project with id " + req.body.id + " updated successfully!");
      res.send("Project with id " + req.body.id + " updated successfully!");
  }).catch(function(e) {
    
    console.log("User update failed ! " + e);
      res.send(e);
  })
}
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
    console.log(req) ;
    console.log('getbyid: -' +idS);
    user = User.findOne({where: {id: idS}}).then(function (userFound) {
        if (userFound==null){
            res.send("user not found");
       }else{
        container={};
        container=userFound;
        container.lastName = userFound.lastname;
        container.firstName = userFound.firstname;
       container.birthday = userFound.bday;
       container.name = userFound.name;
        container.interests=userFound.interests.split(",");
        console.log(container);
        res.send(container);
       }
    
    }).error(function (err) {
        console.log("Error:" + err);
    });
    }
    exports.getUserByEmail= function(req,res){
 
        emailS = req.params.email;
        console.log('getbyemail1: ' +emailS);
        user = User.findOne({where: {email: emailS}}).then(function (userFound) {
           if (userFound==null){
                res.send("user not found");
           }else{
            container={};
            container.name = userFound.name;
            container.email = userFound.email;
            container.acctype = userFound.acctype;
            if (userFound!=null && userFound.interests!=null)
                container.interests=userFound.interests.split(",");
            else
                container.interests = null;
            container.lastName = userFound.lastname;
            container.firstName = userFound.firstname;
            container.description = userFound.description;
            container.gender = userFound.gender;
            container.birthday = userFound.bday;
            container.id = userFound.id;
            console.log(container);
            res.send(container);
           }
        }).error(function (err) {
            console.log("Error:" + err);
        });
        }
        exports.getUserByName= function(req,res){
 
            nameS = req.params.name;
            console.log('getbyname: ' +nameS);
            user = User.findOne({where: {name: nameS}}).then(function (userFound) {
                if (userFound==null){
                    res.send("user not found");
               }else{
                container={};
                container=userFound;
                container.interests=userFound.interests.split(",");
                container.lastName = userFound.lastname;
                container.firstName = userFound.firstname;
                container.birthday = userFound.bday;
                res.send(container);
               }
            
            }).error(function (err) {
                console.log("Error:" + err);
            });
            }
exports.createUser = function (req, res) {

    let { name, firstname, lastname, email, acctype,
        bday, pass, description, interests,
        trustscore, img, gender } = req.body;
    let errors = [];
    if (errors.length > 0) {
        res.put('err', {
            errors
        });
    } else {
        emailS = email;
        console.log('getbyemail: ' +emailS);
        user = User.findOne({where: {email: emailS}}).then(function(entries){
            if (entries==null){
                interestsVar = null;
                if (interests!=null)
                        interestsVar = interests.toString();
                User.create({
                    name, firstname, lastname, email, acctype,
                    bday, pass, description, interests : interestsVar,
                    trustscore, img, gender
                }).then(a => {
                    console.log('added user' + a.id);
                    res.json(a.id);
                }).catch(err => console.log(err));
            }
            else{
                console.log("user exists: " + entries.id);
                res.json(entries.id);
            }
        });
     

    }

}