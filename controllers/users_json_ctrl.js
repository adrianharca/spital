const User = require('../models/User');
const jwt = require('jsonwebtoken');
var ImageEntity = require("../models/ImageEntity");
var Image = require("../models/Image");
var Global = require("../functions.js");
const bcrypt = require('bcrypt');
console.log("user_json_ctrl");

exports.login = async function (req, res) {

  console.log("user: " + JSON.stringify(req.body));
  var acctype = req.body.accountType.toString();
  user = User.findOne({ where: { email: req.body.email, acctype: req.body.accountType } }).then(async function (userFound) {
    login = {};

    if (userFound == null) {
      if (acctype == "Facebook") {
        User.create({
          email: req.body.email, acctype: acctype, name: req.body.email
        }).then(user => {
          token = getToken(user);
          sendUser(res, user, token);
        });
      }
      else {
        console.log("cannot find user")
        // return res.json("Cannot find user in database")
        login = {};
        login.token = "Cannot find user in database"
        return res.json(login)
      }
    }
    else {
      if (userFound.pass != null && userFound.pass != undefined && userFound.pass != "") {
        if (await bcrypt.compare(req.body.password, userFound.pass)) {
          token = getToken(userFound);
          sendUser(res, userFound, token);
        }
        else {
          login = {};
          login.token = "Incorrect password";
          return res.json(login);
        }
      }
      else {
        token = getToken(userFound);
        sendUser(res, userFound, token);
      }
    }

  }).catch(function (e) {
    console.log("User retrieve failed! " + e);
    res.json("User retrieve failed");
  })
};
function getToken(user) {
  const token = jwt.sign(
    { userId: user.id },
    'RANDOM_TOKEN_SECRET',
    { expiresIn: '24h' });
  console.log(token);
  return token;
}
function sendUser(res, userFound, token) {
  fetchedUser = renderUser(userFound);
  fetchedUser.password = null;
  fetchedUser.image = null;
  fetchedUser.token = token;
  console.log(JSON.stringify(fetchedUser));
  return res.json(fetchedUser);
}
exports.addPassword = async function (req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  }
  catch{
    res.status(500).send()
  }
};





exports.createAccount = async function (req, res) {
  console.log("creates account");
  generalCreate(req, res);
  
};
function  verifyToken(req,res) {
  const bearerHeader = req.headers['x-access-token'] || req.headers['authorization'];
  var bearerToken;
  if (bearerHeader) {
    if (bearerHeader.indexOf(' ') > 0) {
      const bearer = bearerHeader.split(' ');
      bearerToken = bearer[1];
    }
    else {
      bearerToken = bearerHeader;
    }
    console.log("token without bearer: " + bearerToken);
   /* jwt.verify(bearerToken.trim(), 'RANDOM_TOKEN_SECRET', function (err, decoded) {
      if (err) {
        console.log(JSON.stringify(err));
        var message;
        message = err.message;
        if (err.expiredAt!=null && err.expiredAt!=undefined){
          message = message + " at " + err.expiredAt;
        }
        err.status = 401
		   	err.message = message
      }
      else {
        console.log("token was authenticated: " + JSON.stringify(decoded));
      }
    });*/
    try {
      var decoded = jwt.verify(bearerToken.trim(), 'RANDOM_TOKEN_SECRET');
      console.log("token was authenticated: " + JSON.stringify(decoded));
      return "";
    } catch(err) {
      console.log("token was not authenticated: " + JSON.stringify(err));
      var message = err.message;
        if (err.expiredAt!=null && err.expiredAt!=undefined){
          message = message + " at " + err.expiredAt;
        }
      return message;
    }
  } else {
    // Forbidden
    return "Forbidden";
  
  }
}

exports.updateUserById =  function (req, res) {
  console.log("update user by Id: " + JSON.stringify(req.body));
  console.log("headers: " + JSON.stringify(req.headers));
  var tokenResponse =  verifyToken(req,res);
  console.log("from update user by id: " + tokenResponse.toString());
  if (tokenResponse=="") {
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
          bday: birthdayVar != null ? birthdayVar.toString() : null, pass: req.body.password, description: req.body.description, interests: interestsVar, gender: req.body.gender
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
  else{      
    res.json(JSON.stringify(tokenResponse));
  
  }
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
      if (imageEntityFound != null) {
        Image.findOne({ id: imageEntityFound.imageId }).then(function (imageFound) {

          if (imageFound != null) {
            console.log(imageFound.path);
            res.sendFile(pathC.resolve(imageFound.path));
          }
          else {
            res.send("null");
          }
        });
      }
      else {
        res.send("null");
      }
    }
    ).error(function (err) {
      console.log("Error:" + "no image found for user");
      res.send(err);
    });
  }
  else {
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

        res.json(c);

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
function generalCreate(req, res) {
  let { name, firstname, lastname, email, accountType,
    bday, password, description, interests,
    trustscore, gender } = req.body;
  let errors = [];
  if (errors.length > 0) {
    res.put('err', {
      errors
    });
  } else {
    emailS = email;
    console.log("account type: " + accountType);
    console.log('getbyemail: ' + emailS + " with bday " + bday);
    user = User.findOne({ where: { email: emailS } }).then(async function (entries) {
      if (entries == null) {
        interestsVar = null;
        if (interests != null)
          interestsVar = interests.toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        User.create({
          name, firstname, lastname, email, acctype: accountType,
          bday, pass: hashedPassword, description, interests: interestsVar,
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
exports.createUser = function (req, res) {
  generalCreate(req, res);
};

//call with authToken
exports.getSelfData = function (uid) {

};