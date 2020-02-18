
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
      circleId: {
        type: Sequelize.INTEGER
      },
      meetId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.TEXT
      },
      motivation: {//todo:remove
        type: Sequelize.TEXT
      }
      // ,
      // image: {
      //   type: Sequelize.TEXT
      // }
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

    this.fkCircle = this.belongsTo(models.Circle, {
      // as: "Circle",
      //   constraints:false
      foreignKey: "circleId"
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
    // this.fkInitiator=this.hasOne(models.Circle,{
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