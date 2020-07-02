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
}
module.exports = InterestCategory;