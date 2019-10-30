const express= require("express");
const bodyParser = require("body-parser");
const exphbs= require ('express-handlebars');
const  path= require("path");
const router=require("./routes/routemap")
console.log('server.js');

//do this once only
var app= express();

app.set('json spaces', 40);
//Handlebars
app.engine('handlebars',exphbs({
    extname: 'handlebars',
    defaultLayout:'main',
    defaultView: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine','handlebars');
// Set static folder
app.use(express.static(path.join(__dirname,'public')));


//Index route
app.get('/',(req,res)=>res.render('index',{layout:'landing'}));
// Body Parser
// support parsing of application/json type post data
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Routes for interface:
app.use("/circles", require('./routes/circles'));
app.use("/users", require('./routes/users'));


//move these into routemap app.use("/users", require('./routes/users'));
app.use("/json", router);
//default route:
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the void',
    }));

    
// app.get("/", function(req,res){
//     res.send("hello baby");
// });
var server=app.listen(3000,function(){
    var host= server.address().address;
    var port=server.address().port;
    console.log("Server listening at :%s on port %s", host,port);
});
module.exports = router;
