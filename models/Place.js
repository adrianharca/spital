//to be ammended w the kind of data we get from gPlaces

const Sequelize = require('sequelize');
// const sequelize = require('../config/db').db;
// const Model = Sequelize.Model;

class Place extends Sequelize.Model {
    // Circle.init({
    // Circle = db.define('circle', {
    static init(sequelize, Sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            placeName: {
                type: Sequelize.TEXT
            },
            location: {
                type: Sequelize.JSON
            },
            address: {
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
    static associate(models) {
        this.nk_meets = this.hasMany(models.Meeting, {
            constraints: false

        });

    }
}
// };}}
module.exports = Place;








    //     // Circle.associate = (models) => {
    //     this.nk_members = this.hasMany(models.Member, {
    //         // as: "Member",
    //         constraints: false
    //         // foreignKey: "circleId",
    //         // foreignKeyConstraint:true 

    //     });

    //     this.nk_image = this.belongsToMany(models.Image, {
    //         through: {
    //             model: models.ImageEntity,
    //             unique: false,
    //             scope: {
    //                 entityType: 'Circle'
    //             }
    //         },
    //         constraints: false,
    //         foreignKey: "imageId"
    //     }
    //     );

    //     // Circle.hasMany(models.Vote, {
    //     //   as: "Votes",
    //     //   constraints: false
    //     //   // foreignKey: "circleId",
    //     //   // foreignKeyConstraint:true 
    //     // });

    //     // this.fkInit = Circle.belongsTo(models.Member, {
    //     //   as: "Initiator",
    //     //   // targetKey: "initiatorid"
    //     //   foreignKey: "initiatorid"
    //     //   // constraints:false
    //     // });