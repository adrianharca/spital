const express = require("express");
var bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const path = require("path");
const router = require("./routes/routemap");

console.log('server.js');



//do this once only
var app = express();




app.set('json spaces', 40);
//Handlebars
app.engine('handlebars', exphbs({
    extname: 'handlebars',
    defaultLayout: 'main',
    defaultView: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'handlebars');
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));


//Index route
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));
// Body Parser
// support parsing of application/json type post data
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
// bodyParser = {
//     json: {limit: '50mb', extended: true},
//     urlencoded: {limit: '50mb', extended: true}
//   };
//   app.use(bodyParser);


//Routes for interface:
app.use("/meetings", require('./routes/meetings'));
app.use("/users", require('./routes/users'));
app.use("/votes", require('./routes/votes'));
//JSON routes
app.use("/json", router);
//default route:

// app.get('*', (req, res) => res.status(200).send({
//     message: 'Welcome to the void',
// }));

// const fs = require('fs')
// const basename = path.basename(module.filename)
// const assoc = require('./models/associations')();
const db = require('./config/db');
// const onlyModels = file =>
//     file.indexOf('.') !== 0 &&
//     file !== basename &&
//     file.slice(-3) === '.js'
// const importModel = file => {
//     const modelPath = path.join(__dirname, file)
//     const model = db.import(modelPath)
//     db[model.name] = model
// }
// // const associate = modelName => {
// //   if (typeof db[modelName].associate === 'function')
// //     db[modelName].associate(db)
// // }

// fs.readdirSync(__dirname)
//     .filter(onlyModels)
//     .forEach(importModel)
// Object.keys(db).forEach(assoc)




var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at :%s on port %s", host, port);
});
var mbdistrib = require('./computation/tstdata');
console.log("Member votes:" + JSON.stringify(mbdistrib.probVects, null, 1));
module.exports = router, bodyParser;
