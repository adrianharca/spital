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
      circleId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      memberId: {
        type: Sequelize.INTEGER
      },
      path: {
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
  } static associate(models){

    
    this.fkIECircle=this.belongsTo(models.Circle, {
      // as: "Circle",
      //   constraints:false
      foreignKey: "circleId"
    });
    this.fkIEUser=this.belongsTo(models.User, {
      // as: "Circle",
      //   constraints:false
      foreignKey: "userId"
    });
    /*
    this.fkIEUser=this.belongsTo(models.User, {
      // as: "Circle",
      //   constraints:false
      foreignKey: "entityId"
    });
    this.fkIEMember=this.belongsTo(models.Member, {
      // as: "Circle",
      //   constraints:false
      foreignKey: "entityId"
    });
    */
    }
   
}
// };}}
module.exports = ImageEntity;