
const Sequelize = require('sequelize');
const db = require('../config/db').db;

const Vote = db.define('vote', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  memberId: {
    type: Sequelize.INTEGER
  },
  circleId: {
    type: Sequelize.INTEGER
  },
  //   status:{
  //     type:Sequelize.INTEGER
  //   },
  date: {
    type: Sequelize.STRING
  },
  endDate: {
    type: Sequelize.STRING
  },
  placename: {
    type: Sequelize.TEXT
  },

  location: {
    type: Sequelize.JSON
  },
  spotType: {
    type: Sequelize.TEXT
  },
  numberofpeople: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: true,
  freezeTableName: true,
  paranoid: true
});
// Vote.associate=(models)=>{
  Vote.belongsTo(Member, {
    as: "Member",
    //   constraints:false
    foreignKey: "memberId"
  });
  Vote.belongsTo(Circle, {
    as: "Circle",

    //    foreignKey:"circleId"
    foreignKey: "circleId"
  });
// };

module.exports = Vote;