
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

module.exports= User;

