//dis di code 4 category
const Sequelize = require('sequelize');
class Interest extends Sequelize.Model {
    static init(sequelize, Sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            interestName: {
                type: Sequelize.TEXT
            },
            categoryId: {
                type: Sequelize.INTEGER
            }
        },
            {
                sequelize,
                modelName: 'interest',
                timestamps: true,
                freezeTableName: true,
                paranoid: true
            }
        );
    };
    static associate(models) {
    this.fkParent = this.belongsTo(models.InterestCategory, {
        as: "Categories",
        // targetKey: "initiatorid"
        foreignKey: "categoryId"
        // constraints:false
    });
}

}

module.exports = Interest;
