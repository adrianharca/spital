 var Circle = require("../models/Circle");
 const Sequelize = require('sequelize');
 const db = require('../config/db');

// console.log('controllers/tasks.js');


// exports.getTasks = function (req, res) {
//     res.send  ("Getting all tasks");
// }

// exports.getTask = function(req,res){
//     res.send("Getting a single task");
// }

// exports.addTask = function(req,res){
//     res.send("Adding task");
// }
// exports.updateTask= function(req,res){
//     res.send("Updating task");
// }
// exports.deleteTask=function(req,res){
//     res.send("Deleted that");
// }
exports.demoadd=function(req,res){
    const data = {
        theme: 'bich',
        description: 'b cray',
        initiatorid: '0',
      }
      let { theme, description, initiatorid } = data;
      Circle.create({
        theme, description, initiatorid
      }).then(a => {
        console.log('created cirlce ' + theme);
        res.redirect('/circles')
      })
        .catch(err => console.log(err));
}