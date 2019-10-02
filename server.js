const express= require("express");
const bodyParser = require("body-parser");
const  path= require("path");


var taskController=require("./controllers/tasks");

var app= express();
var router = express.Router();
app.use("/api", router);
router.route("/tasks").get(taskController.getTasks);
router.route("/task").get(taskController.getTask);
router.route("/addTask").post(taskController.addTask);
router.route("/updateTask").post(taskController.updateTask);
router.route("/deteteTask").get(taskController.deleteTask);



app.get("/", function(req,res){
    res.send("hello baby");
});
var server=app.listen(3000,function(){
    var host= server.address().address;
    var port=server.address().port;
    console.log("Server listening at :%s on port %s", host,port);
})