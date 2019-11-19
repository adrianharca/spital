const Sequelize = require("sequelize");
console.log('config/db.js');


const db = new Sequelize('circles', 'root', 'root', {
    host: 'localhost',
    port: '3308',
    dialect: 'mysql',
    // define:{
    //     timestamps:false
    // },
    operatorAliases: false,
  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        // useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true,
        timezone: '+02:00'
  },
  timezone: '+02:00' //for writing to database
});

db.authenticate()
.then(() => console.log('Db connected'))
.catch(err => console.log('Err: ' + err));

//Do following to autosync db to model. Eg. for init purposes


// console.log("Db sync and destroy about to start:");
// db.sync({ alter: true,force:true })
//   .then(() => {
//     console.log(`Database & tables created!`)
//   });

module.exports={db};
