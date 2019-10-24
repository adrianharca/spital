
const Sequelize= require ('sequelize');
const db= require ('../config/db').db;

const User = db.define('user', {
  id:{
    type:Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name:{
    type:Sequelize.TEXT
  },
  firstname:{
    type:Sequelize.TEXT
  },
  lastname:{
    type:Sequelize.TEXT
  },
  email:{
    type:Sequelize.TEXT
  },
  acctype:{
    type:Sequelize.TEXT
  },
  bday:{
    type:Sequelize.INTEGER
  },
  pass:{
    type:Sequelize.TEXT
  },
  description:{
    type:Sequelize.TEXT
  },
  interests:{
    type:Sequelize.TEXT
  },
  trustscore:{
    
   type:Sequelize.DOUBLE
  },
  img:{
    type:Sequelize.BLOB
  },
  gender:{
    type:Sequelize.TEXT
  }},{
  timestamps:true,
  freezeTableName: true,
  paranoid:true
})
User.associate= (models)=>{
  User.hasMany(models.Member)
}
module.exports= User;
// const mariadb = require('mariadb');
// mariadb.createConnection({
//       host: 'localhost', 
//       user:'root',
//       password: 'root'
//     })
//     .then(conn => {
//       console.log("connected ! connection id is " + conn.threadId);
//     })
//     .catch(err => {
//       console.log("not connected due to error: " + err);
//     });
// var mysql = require('mysql2');

// var con = mysql.createConnection({
//   host: "localhost:3308",
//   user: "root",
//   password: "root",
//   database: "circles"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
//   // con.query(sql, function (err, result) {
//   //   if (err) throw err;
//   //   console.log("1 record inserted");
//   // });
// });
