//dis di code 4 category
const Sequelize = require('sequelize');

class InterestCategory extends Sequelize.Model {
    static init(sequelize, Sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            categoryName: {
                type: Sequelize.TEXT
            },
            imageId: {
                type: Sequelize.TEXT
            }
        },
            {
                sequelize,
                modelName: 'category',
                timestamps: true,
                freezeTableName: true,
                paranoid: true
            }
        );
    };
    static associate(models) {
        this.nk_images = this.belongsToMany(models.Image, {
            through: {
              model: models.ImageEntity,
              unique: false,
              scope: {
                entityType: 'Image'
              }
            },
            foreignKey: 'entityId',
            constraints: false
          });
    }
    //
}
module.exports = InterestCategory;