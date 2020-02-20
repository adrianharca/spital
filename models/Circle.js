//dis di code 4 circle
const Sequelize = require('sequelize');
// const sequelize = require('../config/db').db;
// const Model = Sequelize.Model;

class Circle extends Sequelize.Model {
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
            initiatorid: {//userId
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
            placeRange: {
                type: Sequelize.JSON
            },
            parentId: {
                type: Sequelize.INTEGER
            }
        },
            {
                sequelize,
                modelName: 'circle',
                timestamps: true,
                freezeTableName: true,
                paranoid: true
            }
        );
    };
    static associate(models) {
        // Circle.associate = (models) => {
        this.nk_members = this.hasMany(models.Member, {
            constraints: false
            // foreignKey: "circleId",
            // foreignKeyConstraint:true 

        });
        this.nk_meets = this.hasMany(models.Meeting, {
            constraints: false

        });
        this.fkParent = this.belongsTo(models.Circle, {
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
        //             entityType: 'Circle'
        //         }
        //     },
        //     constraints: false,
        //     foreignKey: "imageId"
        // }
        // );

        // Circle.hasMany(models.Vote, {
        //   as: "Votes",
        //   constraints: false
        //   // foreignKey: "circleId",
        //   // foreignKeyConstraint:true 
        // });

        // this.fkInit = Circle.belongsTo(models.Member, {
        //   as: "Initiator",
        //   // targetKey: "initiatorid"
        //   foreignKey: "initiatorid"
        //   // constraints:false
        // });
    }
}
// };}}
module.exports = Circle;