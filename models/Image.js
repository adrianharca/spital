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



    this.fkIEMeeting = this.belongsToMany(models.Meeting, {
      through: {
        model: models.ImageEntity,
        unique: false,
        scope: {
          entityType: 'Meeting'
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
module.exports = Image;