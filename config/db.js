const Sequelize = require("sequelize");
const db = new Sequelize('circles', 'root', 'root', {
    host: 'localhost',
    port: '3308',
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
db.authenticate()
.then(() => console.log('Db connected'))
.catch(err => console.log('Err: ' + err));
module.exports={db};
