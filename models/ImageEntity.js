
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
      entityid: {
        type: Sequelize.INTEGER
      },
      entityType: {
        type: Sequelize.STRING
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
  }
   
}
// };}}
module.exports = ImageEntity;