
const Sequelize= require ('sequelize');
const db= require ('../config/db').db;

const Member = db.define('member', {
  id:{
    type:Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  circleId:{
    type:Sequelize.INTEGER
  },
  age:{
    type:Sequelize.INTEGER
  },
  userId:{
    type:Sequelize.INTEGER
  },
  nickname:{
    type:Sequelize.TEXT,
  },
  image:{
    type:Sequelize.BLOB
  }},{
  timestamps:true,
freezeTableName: true,
paranoid:true

})
Member.associate = (models)=> {
  Member.belongsToMany(models.Circle,{
    as:"Circle", foreignKey:"circleId"
  })
}
Member.associate = (models)=>{
  Member.belongsTo(models.User,{
    as:"User", foreignKey:"userid"
  })
}
module.exports= Member;