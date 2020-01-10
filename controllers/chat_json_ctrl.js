const User = require('../models/User');

var ImageEntity = require("../models/ImageEntity");
var Global = require("../functions.js");
exports.getChatPage = function (req, res) {
    var path = require('path');
   res.sendFile(path.resolve(__dirname + '/../index.html'));
    console.log('success');
  }
  
 console.log("chat_json_ctrl");
var appVar = require('express')();
var http = require('http').createServer(appVar);
var io = require('socket.io')(http);
appVar.get('/',exports.getChatPage);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
  });
  http.listen(3500, function(){
    console.log('listening on *:3500');
  });
