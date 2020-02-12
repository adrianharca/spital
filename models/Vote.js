
const Sequelize = require('sequelize');
// const db = require('../config/db').db;

//  Vote = db.define('vote', {
class Vote extends Sequelize.Model {
  // Vote.init({
  static init(sequelize, Sequelize) {
    return super.init({
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
      meetingId: {
        type: Sequelize.INTEGER
      },
      //   status:{
      //     type:Sequelize.INTEGER
      //   },
      date: {
        type: Sequelize.STRING
      },
      timeofday: {
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
      sequelize,
      modelName: 'vote',
      timestamps: true,
      freezeTableName: true,
      paranoid: true
    });
  }
  // Vote.associate=(models)=>{
  static associate(models) {
    this.fkMb = this.belongsTo(models.Member, {
      as: "Member",
      //   constraints:false
      foreignKey: "memberId"
    });
    this.fkMeeting = this.belongsTo(models.Meeting, {
      as: "Meeting",

      //    foreignKey:"meetingId"
      foreignKey: "meetingId"
    });
  };
}
module.exports = Vote;