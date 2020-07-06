const Sequelize = require('sequelize');

class Image extends Sequelize.Model {

  static init(sequelize, Sequelize) {
    return super.init({
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      path: {
        type: Sequelize.STRING
      }
    },
      {
        sequelize,
        modelName: 'image',
        timestamps: true,
        freezeTableName: true,
        paranoid: true
      }
    );
  };

  static associate(models) {

  
    
    this.belongsToMany(models.InterestCategory, {
      through: {
        model: models.ImageEntity,
        unique: false,
        scope: {
          entityType: 'InterestCategory'
        }
      },
      foreignKey: 'entityId',
      constraints: false
    });

    this.fkIECircle = this.belongsToMany(models.Circle, {
      through: {
        model: models.ImageEntity,
        unique: false,
        scope: {
          entityType: 'Circle'
        }
      },
      foreignKey: 'entityId',
      constraints: false
    });
    this.fkIEUser = this.belongsToMany(models.User, {
      through: {
        model: models.ImageEntity,
        unique: false,
        scope: {
          entityType: 'User'
        }
      },
      foreignKey: 'entityId',
      constraints: false
    });
    this.fkIEUser = this.belongsToMany(models.Member, {
      through: {
        model: models.ImageEntity,
        unique: false,
        scope: {
          entityType: 'Member'
        }
      },
      foreignKey: 'entityId',
      constraints: false
    });
    /* this.fkIEUser=this.belongsTo(models.User, {
       // as: "Circle",
       //   constraints:false
       foreignKey: "entityId"
     });*/
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
module.exports = Image;