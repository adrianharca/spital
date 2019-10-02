
const Sequelize= require ('sequelize');
const db= require ('../config/db').db;

const Circle = db.define('circle', {
  id:{
    type:Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  theme:{
    type:Sequelize.TEXT
  },
  keywords:{
    type:Sequelize.TEXT
  },
  status:{
    type:Sequelize.INTEGER
  },
  initiatorid:{
    type:Sequelize.INTEGER,
  },
  image:{
    type:Sequelize.BLOB
  },
  creationDate:{
    type:Sequelize.INTEGER
  },
  invitationOnly:{
    type:Sequelize.INTEGER
  },
  openToAnyone:{
    type:Sequelize.INTEGER
  },
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
module.exports= Circle;