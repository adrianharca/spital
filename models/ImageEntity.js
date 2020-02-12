const Sequelize = require('sequelize');

class ImageEntity extends Sequelize.Model {

  static init(sequelize, Sequelize) {
    return super.init({
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      entityId: {
        type: Sequelize.INTEGER
      },
      imageId: {
        type: Sequelize.INTEGER
      },
      entityType: {
        type: Sequelize.STRING
      }
    },
      {
        sequelize,
        modelName: 'imageentity',
        timestamps: true,
        freezeTableName: true,
        paranoid: true
      }
    );
  } static associate(models) {
    /*
    this.fkIEMeeting=this.belongsTo(models.Meeting, {
      // as: "Meeting",
      //   constraints:false
      foreignKey: "entityId"
    });
    this.fkIEUser=this.belongsTo(models.User, {
      // as: "Meeting",
      //   constraints:false
      foreignKey: "entityId"
    });*/
    /*
    this.fkIEUser=this.belongsTo(models.User, {
      // as: "Meeting",
      //   constraints:false
      foreignKey: "entityId"
    });
    this.fkIEMember=this.belongsTo(models.Member, {
      // as: "Meeting",
      //   constraints:false
      foreignKey: "entityId"
    });
    */
  }

}
// };}}
module.exports = ImageEntity;