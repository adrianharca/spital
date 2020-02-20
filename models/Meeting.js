
const Sequelize = require('sequelize');
// const sequelize = require('../config/db').db;
// const Model = Sequelize.Model;

class Meeting extends Sequelize.Model {
  // Meeting.init({
  // Meeting = db.define('meeting', {
  static init(sequelize, Sequelize) {
    return super.init({
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      theme: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      keywords: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
      },
      initiatorid: {
        type: Sequelize.INTEGER
      },
      // image: {
      //   type: Sequelize.TEXT
      // },
      privacy: {
        type: Sequelize.INTEGER
      },
      minCrowd: {
        type: Sequelize.INTEGER
      },
      maxCrowd: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING
      },
      endDate: {
        type: Sequelize.STRING
      },
      placeId: {
        type: Sequelize.INTEGER
      },
      circleId: {
        type: Sequelize.INTEGER
      },
      parentId: {
        type: Sequelize.INTEGER
      }
    },
      {
        sequelize,
        modelName: 'meeting',
        timestamps: true,
        freezeTableName: true,
        paranoid: true
      }
    );
  };
  static associate(models) {
    // Meeting.associate = (models) => {
    this.nk_members = this.hasMany(models.Member, {
      // as: "Member",
      constraints: false
      // foreignKey: "meetingId",
      // foreignKeyConstraint:true 

    });
    this.fkCircle = this.belongsTo(models.Circle, {

      foreignKey: "circleId"
    });
    this.fkParent = this.belongsTo(models.Meeting, {
      as: "Parent",
      foreignKey: "parentId"
    });
    this.fkplace = this.belongsTo(models.Place, {
      foreignKey: "placeId"
    });
    this.nk_meets = this.hasMany(models.Meeting, {
      as: 'Babies',
      constraints: false

    });
    this.nk_mbs = this.hasMany(models.Member, {
      constraints: false

    });
    this.nkvote = this.belongsToMany(models.Vote, {
      through: {
        model: models.MemberVote,
        unique: false
        // scope: {
        //   entityType: 'Meeting'
        // }
      },
      constraints: false,
      foreignKey: "voteId"
    }
    );
    // this.nk_image = this.belongsToMany(models.Image, {
    //   through: {
    //     model: models.ImageEntity,
    //     unique: false,
    //     scope: {
    //       entityType: 'Meeting'
    //     }
    //   },
    //   constraints: false,
    //   foreignKey: "imageId"
    // }
    // );

    // Meeting.hasMany(models.Vote, {
    //   as: "Votes",
    //   constraints: false
    //   // foreignKey: "meetingId",
    //   // foreignKeyConstraint:true 
    // });

    // this.fkInit = Meeting.belongsTo(models.Member, {
    //   as: "Initiator",
    //   // targetKey: "initiatorid"
    //   foreignKey: "initiatorid"
    //   // constraints:false
    // });
  }
}
// };}}
module.exports = Meeting;