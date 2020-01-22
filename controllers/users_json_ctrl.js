const User = require('../models/User');

var ImageEntity = require("../models/ImageEntity");
var Image = require("../models/Image");
var Global = require("../functions.js");
console.log("user_json_ctrl");

exports.updateUserById = function (req, res) {
  console.log("update user by Id: " + JSON.stringify(req.body));
  interestsVar = null;
  birthdayVar = null;
  if (req.body.interests != null)
    interestsVar = req.body.interests.toString();
  if (req.body.birthday != null) {
    {
      birthdayVar = Date.parse(req.body.birthday);
    }
  }
  console.log(req.body.email + " with email " + req.body.email + " and " + req.body.accountType + " will be updated");
  var idOne = req.body.id;
  user = User.findOne({ where: { email: req.body.email, acctype: req.body.accountType } }).then(function (userFound) {
    console.log("before found");
    if (userFound != null) {
      console.log("found");
      User.update(
        {
          name: req.body.name,
          firstname: req.body.firstName,
          lastname: req.body.lastName,
          email: req.body.email,
          acctype: req.body.accountType,
          bday: birthdayVar != null ? birthdayVar.toString() : null,
          description: req.body.description,
          interests: interestsVar,
          gender: req.body.gender
        },
        { where: { email: req.body.email, acctype: req.body.accountType } }
      )
        .then(function () {
          if (req.body.image != undefined) {
            var filename = Global.createFile(req.body.image, req.body.email + "-" + req.body.accountType, "users");
            if (filename != "") {
              /*
                            image = ImageEntity.findOne({ where: { entityId: idOne, entityType: "User" } }).then(function (c) {
                              if (c == null) {
                                ImageEntity.create({
                                  path: filename, entityId: req.body.id, entityType: "User"
                                }).then(a => { console.log("created file") });
                              }
                              else {
                                console.log("Image entry is already created...");
                              }
                            }).error(function (err) {
                              console.log("Error:" + err);
                            });
              */
            }
            console.log("User with id " + req.body.id + " updated successfully!");
            res.send(req.body.id);
            //res.send("User with id " + req.body.id.toString() + " updated successfully!");
          }
        }).catch(function (e) {

          console.log("User update failed ! " + e);
          res.send(e);
        })


    }
    else {
      User.create({
        name: req.body.name, firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, acctype: req.body.accountType,
        bday: birthdayVar != null ? birthdayVar.toString() : null, pass: "", description: req.body.description, interests: interestsVar, gender: req.body.gender
      }).then(a => {
        /*
        var filename = Global.createFile(req.body.img, req.body.email + "-" + req.body.accountType, "users");
        if (filename != "")
          ImageEntity.create({
            path: filename, entityId: a.id, entityType: "User"
          }).then(a => { console.log("created file") });
          */
        console.log('success');
        console.log('added user' + a.id);
        res.json(a.id);
      }).catch(err => console.log("error: " + err));
    }
  });

}
exports.getImageById = function (req, res) {  
  idS = Number(req.params.id);

  var mainPath = __dirname + "\\.." + "\\public\\img\\";
  var path = mainPath + "users";
  var pathC = require("path");
  var shell = require('shelljs');
  if (!isNaN(idS)) {
    console.log('getbyid' + idS);
    circless = ImageEntity.findOne({ where: { entityId: idS, entityType: "User" } }).then(function (imageEntityFound) {
      if (imageEntityFound!=null){
      Image.findOne({id: imageEntityFound.imageId}). then(function (imageFound) {

        if (imageFound != null) {
          console.log(imageFound.path);
          res.sendFile(pathC.resolve(imageFound.path));
        }
        else {
          res.send("null");
        }
      });
    }
    else{
      res.send("null");
    }
    }
  ).error(function (err) {
      console.log("Error:" + "no image found for user");
      res.send(err);
    });
  }
  else{
    res.send("not a number");
  }
 // res.send("Aaa");
}
exports.getAllUsers = function (req, res) {
  User.findAll().map(l => {

   /* container = {};
    container = l;
    container.interests = l.interests.split(",");
    container.accountType = l.acctype;*/
    container = renderUser(l);
    return container;
  })
    .then(
      c => {

        res.json( c );

        console.log('result: shown all users ');
      })

    .catch(err => console.log(err));
}
exports.delete = function (req, res) {
  console.log('deleted');
}

exports.getUserById = function (req, res) {

  idS = Number(req.params.id);
  if (!isNaN(idS)) {
    console.log('getbyid: -' + idS);
    user = User.findOne({ where: { id: idS } }).then(function (userFound) {
      if (userFound == null) {
        res.send("user not found");
      } else {
        container = renderUser(userFound);
        res.send(container);

      }

    }).error(function (err) {
      console.log("Error:" + err);
    });
  }
}

function renderUser(u) {
  const fields = ['id', 'email', 'trustscore', 'description', 'gender',
    'name', 'createdAt', 'updatedAt', 'deletedAt'];

  var container = new Object();
  fields.forEach((item) => {
    //console.log(item, ' ', u[item]);
    container[item] = u[item];
  });
  container.accountType = u.acctype;
  container.firstName = u.firstname;
  container.lastName = u.lastname;
  if (u.interests != null) {
    container.interests = u.interests.split(",");
  }
  else
    container.interests = [];
  container.birthday = u.bday;
  return container;
}
exports.getUserByEmail = function (req, res) {

  emailS = req.params.email;
  console.log('getbyemail1: ' + emailS);
  user = User.findOne({ where: { email: emailS } }).then(function (userFound) {
    if (userFound == null) {
      container = {};
      container.error = "user not found";
      res.send(container);
    } else {
      container = renderUser(userFound);

      res.send(container);
    }
  }).error(function (err) {
    console.log("Error:" + err);
  });
}
exports.getUserByName = function (req, res) {

  nameS = req.params.name;
  console.log('getbyname: ' + nameS);
  user = User.findOne({ where: { name: nameS } }).then(function (userFound) {
    if (userFound == null) {
      res.send("user not found");
    } else {
      var container = {};
      container = renderUser(userFound);
      res.send(container);
    }
  }).error(function (err) {
    console.log("Error:" + err);
  });
}

exports.createUser = function (req, res) {

  let { name, firstname, lastname, email, accountType,
    bday, pass, description, interests,
    trustscore, gender } = req.body;
  let errors = [];
  if (errors.length > 0) {
    res.put('err', {
      errors
    });
  } else {
    emailS = email;
    console.log("account type: " + req.body.accountType);
    console.log('getbyemail: ' + emailS + " with bday " + bday);
    user = User.findOne({ where: { email: emailS } }).then(function (entries) {
      if (entries == null) {
        interestsVar = null;
        if (interests != null)
          interestsVar = interests.toString();
        User.create({
          name, firstname, lastname, email, acctype: req.body.accountType,
          bday, pass, description, interests: interestsVar,
          trustscore, gender
        }).then(a => {
          /*
          var filename = Global.createFile(req.body.img, req.body.email + "-" + req.body.accountType, "users");
          if (filename != "")
            ImageEntity.create({
              path: filename, entityId: a.id, entityType: "User"
            }).then(a => { console.log("created file") });*/
          console.log('success');
          console.log('added user' + a.id);
          res.json(a.id);
          //res.json(a);
        }).catch(err => console.log(err));
      }
      else {
        console.log("user exists: " + entries.id);
        res.json(entries.id);
      }
    });


  }

}