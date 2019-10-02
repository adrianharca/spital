
const Sequelize= require ('sequelize');
const db= require ('../config/db').db;

const Vote = db.define('vote', {
  id:{
    type:Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  memberId:{
    type:Sequelize.INTEGER
  },
  circleId:{
    type:Sequelize.INTEGER
  },
//   status:{
//     type:Sequelize.INTEGER
//   },
  date:{
    type:Sequelize.INTEGER
  },
  endDate:{
    type:Sequelize.INTEGER
  },
  placename:{ 
   type:Sequelize.TEXT
  },
 
  location:{
    type:Sequelize.TEXT
  },
  spotType:{
    type:Sequelize.TEXT
  }

})
module.exports= Vote;