
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
  description:{
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
  }},
  {timestamps:true,
  freezeTableName: true,
  paranoid:true}
)
Circle.associate = (models)=>{
  Circle.hasMany(models.Member,{
    as:"Member", foreignKey:"circleId"
  })
}
Circle.associate = (models) =>{
  Circle.hasMany (models.Vote,{
    as:"Options",foreignKey:"circleId"
  })
}
module.exports= Circle;