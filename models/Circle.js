
const Sequelize = require('sequelize');
const db = require('../config/db').db;

const Circle = db.define('circle', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  theme: {
    type: Sequelize.TEXT
  },
  description: {
    type: Sequelize.TEXT
  },
  keywords: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.INTEGER
  },
  initiatorid: {
    type: Sequelize.INTEGER
  },
  image: {
    type: Sequelize.BLOB
  },
  creationDate: {
    type: Sequelize.STRING
  },
  invitationOnly: {
    type: Sequelize.BOOLEAN
  },
  openToAnyone: {
    type: Sequelize.BOOLEAN
  },
  date: {
    type: Sequelize.STRING
  },
  endDate: {
    type: Sequelize.STRING
  },
  placename: {
    type: Sequelize.TEXT
  },
  isFlexible: {
    type: Sequelize.BOOLEAN
  },
  location: {
    type: Sequelize.JSON
  },
  timeofday: {
    type: Sequelize.TEXT
  },
  spotType: {
    type: Sequelize.TEXT
  }
},
  {
    timestamps: true,
    freezeTableName: true,
    paranoid: true
  }
)
Circle.associate = (models) => 
  Circle.hasMany(models.Member, {
    as: "Member", 
    foreignKey: "circleId"
  })

Circle.associate = (models) => 
  Circle.hasMany(models.Vote, {
    as: "Options",
    foreignKey: "circleId"
  }
  )

Circle.associate = ()=>Circle.belongsTo(User,{
  as:"Initiator",
  constraints:false
})

module.exports = Circle;