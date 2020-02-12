//to be ammended w the kind of data we get from gPlaces

const Sequelize = require('sequelize');
// const sequelize = require('../config/db').db;
// const Model = Sequelize.Model;

class Place extends Sequelize.Model {
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
            image: {
                type: Sequelize.TEXT
            },
            placename: {
                type: Sequelize.TEXT
            },
            location: {
                type: Sequelize.JSON
            },
            spotType: {
                type: Sequelize.TEXT
            }
        },
            {
                sequelize,
                modelName: 'place',
                timestamps: true,
                freezeTableName: true,
                paranoid: true
            }
        );
    };
    // static associate(models) {
    //     // Meeting.associate = (models) => {
    //     this.nk_members = this.hasMany(models.Member, {
    //         // as: "Member",
    //         constraints: false
    //         // foreignKey: "meetingId",
    //         // foreignKeyConstraint:true 

    //     });

    //     this.nk_image = this.belongsToMany(models.Image, {
    //         through: {
    //             model: models.ImageEntity,
    //             unique: false,
    //             scope: {
    //                 entityType: 'Meeting'
    //             }
    //         },
    //         constraints: false,
    //         foreignKey: "imageId"
    //     }
    //     );

    //     // Meeting.hasMany(models.Vote, {
    //     //   as: "Votes",
    //     //   constraints: false
    //     //   // foreignKey: "meetingId",
    //     //   // foreignKeyConstraint:true 
    //     // });

    //     // this.fkInit = Meeting.belongsTo(models.Member, {
    //     //   as: "Initiator",
    //     //   // targetKey: "initiatorid"
    //     //   foreignKey: "initiatorid"
    //     //   // constraints:false
    //     // });
    // }
}
// };}}
module.exports = Place;