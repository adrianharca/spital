
const Sequelize = require('sequelize');
// const sequelize= require ('../config/db').db;

//  User = db.define('user', {
class User extends Sequelize.Model {
  // User.init({ 
  static init(sequelize, Sequelize) {
    return super.init({
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.TEXT
      },
      firstname: {
        type: Sequelize.TEXT
      },
      lastname: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      acctype: {
        type: Sequelize.TEXT
      },
      bday: {
        type: Sequelize.STRING
      }, 
      pass: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      interests: {
        type: Sequelize.TEXT
      },
      trustscore: {

        type: Sequelize.DOUBLE
      },
      gender: {
        type: Sequelize.TEXT
      }
    }, {
      sequelize,
      modelName: 'user',
      timestamps: true,
      freezeTableName: true,
      paranoid: true
    });
  }
  // User.associate=(models)=>{
  static associate(models) {
    this.nk_mbs = User.hasMany(models.Member, {
      constraints: false
    });
    /*
    this.nk_imgs = User.hasOne(models.ImageEntity, {
      foreignKey: 'entityId',
      constraints: false
    });*/
    // };
  }
}
module.exports = User;

