//dis di code 4 meeting
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
            image: {
                type: Sequelize.TEXT
            },
            privacy: {
                type: Sequelize.INTEGER
            },
            placename: {
                type: Sequelize.TEXT
            },
            range: {
                type: Sequelize.JSON
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
            constraints: false
            // foreignKey: "meetingId",
            // foreignKeyConstraint:true 

        });
        this.fkParent = Meeting.belongsTo(models.Meeting, {
            as: "Parent",
            // targetKey: "initiatorid"
            foreignKey: "parentId"
            // constraints:false
        });
        // this.nk_image = this.belongsToMany(models.Image, {
        //     through: {
        //         model: models.ImageEntity,
        //         unique: false,
        //         scope: {
        //             entityType: 'Meeting'
        //         }
        //     },
        //     constraints: false,
        //     foreignKey: "imageId"
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