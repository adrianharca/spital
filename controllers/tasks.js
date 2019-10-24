var Task = require("../models/User");

console.log('controllers/tasks.js');


exports.getTasks = function (req, res) {
    res.send  ("Getting all tasks");
}

exports.getTask = function(req,res){
    res.send("Getting a single task");
}

exports.addTask = function(req,res){
    res.send("Adding task");
}
exports.updateTask= function(req,res){
    res.send("Updating task");
}
exports.deleteTask=function(req,res){
    res.send("Deleted that");
}