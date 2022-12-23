const express = require("express");
var bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const path = require("path");
const router = require("./routes/routemap");
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); 
console.log('server.js');
const multer = require('multer'); 
const chart = require('chart');
const sessions = require('express-session');
//do this once only
var app = express();
const oneDay = 1000 * 60 * 60 * 24;
app.use(cors());
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
});
var folder = 'public/uploads2';

if (!fs.existsSync(folder)){

    fs.mkdirSync(folder);
    console.log('Folder to upload images was created successfully.');

}

app.set('json spaces', 40);
//Handlebars
app.engine('handlebars', exphbs.engine({
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
app.use("/setup", require('./routes/setup'));
app.use("/epicriza_etapa", require('./routes/epicrizaetapa'));
app.use("/foaie_observatie", require('./routes/foaieobservatie'));
app.use("/buletin_analize_hemato", require('./routes/buletinanalizehemato'));
app.use("/buletin_analize_coagulare", require('./routes/buletinanalizecoagulare'));
app.use("/buletin_analize_biochimie", require('./routes/buletinanalizebiochimie'));
app.use("/foaie_temperatura", require('./routes/foaietemperatura'));
app.use("/fisa_terapie", require('./routes/fisaterapie'));
app.use("/circles", require('./routes/circles'));
app.use("/users", require('./routes/users'));
app.use("/audit", require('./routes/audit'));
app.use("/votes", require('./routes/votes'));
app.use("/categories", require('./routes/categories'));
app.use("/interests", require('./routes/interests'));
app.use("/pacients", require('./routes/pacients'));
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
//console.log("Member votes:" + JSON.stringify(mbdistrib.probVects, null, 1));
module.exports = router, bodyParser, chart;
