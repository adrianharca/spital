
const Sequelize = require('sequelize');
// const sequelize = require('../config/db').db;

//  Member  = db.define('member', {
class Member extends Sequelize.Model {
  // Member.init({
  static init(sequelize, Sequelize) {
    return super.init({
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      meetingId: {
        type: Sequelize.INTEGER
      },
      age: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.TEXT
      },
      motivation: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.TEXT
      }
    }, {
      sequelize,
      modelName: 'member',
      timestamps: true,
      freezeTableName: true,
      paranoid: true

    });
  }
  // Member.associate=(models)=>{
  static associate(models) {

    this.fkMeeting = this.belongsTo(models.Meeting, {
      // as: "Meeting",
      //   constraints:false
      foreignKey: "meetingId"
    });
    this.nk_image = this.belongsToMany(models.Image, {
      through: {
        model: models.ImageEntity,
        unique: false,
        scope: {
          entityType: 'Member'
        }
      },
      constraints: false,
      foreignKey: "imageId"
    }
    );
    // this.fkInitiator=this.hasOne(models.Meeting,{
    //   as:"Initiator",
    //   foreignKey:"initiatorid"
    // })
    this.fkuser = this.belongsTo(models.User, {
      // as: "User",
      //   constraints:false
      foreignKey: "userId"
    });
  };
}
module.exports = Member;