
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
      // memberId: {
      //   type: Sequelize.INTEGER
      // },
      // meetId: {
      //   type: Sequelize.INTEGER
      // },
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
      placeId: {
        type: Sequelize.INTEGER
      }
      // placename: {
      //   type: Sequelize.TEXT
      // },

      // location: {
      //   type: Sequelize.JSON
      // },
      // spotType: {
      //   type: Sequelize.TEXT
      // },
      // numberofpeople: {
      //   type: Sequelize.INTEGER
      // }
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
    this.fkplace = this.belongsTo(models.Place, {
      foreignKey: "placeId"
    });
    this.nkMb = this.belongsToMany(models.Member, {
      through: {
        model: models.MemberVote,
        unique: false
        // scope: {
        //   entityType: 'Vote'
        // }
      },
      constraints: false,
      foreignKey: "memberId"
    }
    );
    this.nkvote = this.belongsToMany(models.Meeting, {
      through: {
        model: models.MemberVote,
        unique: false
        // scope: {
        //   entityType: 'Meeting'
        // }
      },
      constraints: false,
      foreignKey: "meetId"
    }
    );
    // this.fkMb = this.belongsTo(models.Member, {
    //   as: "Member",
    //   //   constraints:false
    //   foreignKey: "memberId"
    // });
    // this.fkCircle = this.belongsTo(models.Circle, {
    //   as: "Circle",

    //   //    foreignKey:"circleId"
    //   foreignKey: "circleId"
    // });
  };
}
module.exports = Vote;