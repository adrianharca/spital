const Sequelize = require("sequelize");
console.log('config/db.js');
const Circle = require("../models/Circle");
const Meeting = require("../models/Meeting");
const Member = require("../models/Member");
const MemberVote = require("../models/MemberVote");
const User = require("../models/User");
const Vote = require("../models/Vote");
const Image = require("../models/Image");
const ImageEntity = require("../models/ImageEntity");
const Place = require("../models/Place");
// const MemberVote = require("../models/MemberVote");




const sequelize = new Sequelize('circles', 'root', 'root', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    // define:{
    //     timestamps:false
    // },
    operatorAliases: false,
    logging: (...msg) => console.log(msg),
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
const models = {
    Circle: Circle.init(sequelize, Sequelize),
    Member: Member.init(sequelize, Sequelize),
    Meeting: Meeting.init(sequelize, Sequelize),
    ImageEntity: ImageEntity.init(sequelize, Sequelize),
    User: User.init(sequelize, Sequelize),
    Vote: Vote.init(sequelize, Sequelize),
    Image: Image.init(sequelize, Sequelize),
    Place: Place.init(sequelize, Sequelize),
    MemberVote: MemberVote.init(sequelize, Sequelize)
};
Object.values(models)
    .filter(model => typeof model.associate == "function")
    .forEach(element => {
        element.associate(models)
    });

sequelize.authenticate()
    .then(() => console.log('Db connected'))
    .catch(err => console.log('Err: ' + err));

//Do following to autosync db to model. Eg. for init purposes


// sequelize.sync({ alter: true })//,force:true
//     .then(() => {
//         console.log(`Database & tables created!`)
//     }).catch(console.log);

module.exports = { sequelize };
