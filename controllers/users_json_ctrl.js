const User = require('../models/User');

var ImageEntity = require("../models/ImageEntity");
var Global = require("../functions.js");
console.log("user_json_ctrl");

exports.updateUserById= function(req,res){
   console.log("update user by Id: ");
   interestsVar = null;
   birthdayVar = "";
   if (req.body.interests!=null)
        interestsVar =  req.body.interests.toString();
   if (req.body.birthday!=null){
               /*if (req.body.birthday.indexOf("T")>0){
                console.log("update one " + req.body.birthday.split("T")[0]);
                birthdayVar = Date.parse(req.body.birthday.split("T")[0]);
               }
         else{
            console.log("update two");*/{
            birthdayVar = Date.parse(req.body.birthday);
         }
   }
   console.log(req.body.email + " with bday " + birthdayVar + "has been updated");
   console.log(req.body);
    var mainPath = __dirname + "\\.." + "\\public\\img\\";
    var path = mainPath + "users";
    var pathC = require("path");
    var shell = require('shelljs');
    const fs = require('fs');
    var filename = path + "\\" + req.body.firstName + "_" + req.body.lastName + "-" + req.body.email + ".jpg";
    User.update(
      {img: filename,
        name: req.body.name,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        acctype: req.body.acctype,
        bday: birthdayVar.toString(),
        description: req.body.description,
        interests: interestsVar,
        gender: req.body.gender
        },
        {where: {id: req.body.id}}
    )
    .then(function() {
        if (req.body.image != undefined) {
            var filename = Global.createFile(req.body.image,req.body.name + "-" + req.body.acctype,"users");
            if (filename!=""){
              
              image = ImageEntity.findOne({ where: { entityid: req.body.id, entityType: "User" } }).then(function (c) {
                if (c==null){
                  ImageEntity.create({
                    path: filename, entityid: req.body.id, entityType: "User"}). then( a => {console.log("created file")});
                }
                else{
                  console.log("Image entry is already created...");
                }
              }).error(function (err) {
                console.log("Error:" + err);
              });
              
          }
      console.log("User with id " + req.body.id + " updated successfully!");
      res.send("User with id " + req.body.id + " updated successfully!");
        }
  }).catch(function(e) {
    
    console.log("User update failed ! " + e);
      res.send(e);
  })
}
exports.getImageById = function (req,res){
    idS = Number(req.params.id);
    
    var mainPath = __dirname + "\\.." + "\\public\\img\\";
    var path = mainPath + "users";
    var pathC = require("path");
    var shell = require('shelljs');
    console.log('getbyid' + idS);
    circless = ImageEntity.findOne({ where: { entityid: idS, entityType: "User"} }).then(function (imageFound) {
      if (imageFound != null) {
        res.sendFile(pathC.resolve(imageFound.path));
      }
      else {
        res.send("null");
      }
    }).error(function (err) {
      console.log("Error:" + "no image found for user");
      res.send(err);
    });
}
exports.getAllUsers =function(req,res){
     User.findAll().map(l=> {container={};
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
            //container.image = userFound.img;
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
                container.image = userFound.img;
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
        trustscore, gender } = req.body;
    let errors = [];
    if (errors.length > 0) {
        res.put('err', {
            errors
        });
    } else {
        emailS = email;
        console.log('getbyemail: ' +emailS + " with bday " +bday);
        user = User.findOne({where: {email: emailS}}).then(function(entries){
            if (entries==null){
                interestsVar = null;
                if (interests!=null)
                        interestsVar = interests.toString();
                User.create({
                    name, firstname, lastname, email, acctype,
                    bday, pass, description, interests : interestsVar,
                    trustscore, gender
                }).then(a => {
                    var filename = createFile(req.body.img,req.body.name + "-" + req.body.acctype,"users");
                    if (filename!="")
                    ImageEntity.create({
                      path: filename, entityid: a.id, entityType: "Users"}). then( a => {console.log("created file")});
                    console.log('success');
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