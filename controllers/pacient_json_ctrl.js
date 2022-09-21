    console.log("pacient_json_ctrl");
    var mysql = require('mysql');



exports.getAllPacients = function (req, res) {
        res.json({'aa': 'aa'});
        console.log('result: shown all pacients');
};
exports.updatePacientById = function (req, res) {
        res.json({'aa': 'aa'});
        console.log('result: shown all pacients');
};
exports.delete = function (req,res) {
};
exports.createPacient = function (req, res) {
var con = mysql.createConnection({
    host: "localhost",
    user: "adrianharca",
    password: "adr04har"
    });
    con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    });

};