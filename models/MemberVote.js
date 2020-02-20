const Sequelize = require('sequelize');

class MemberVote extends Sequelize.Model {

    static init(sequelize, Sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            meetId: {
                type: Sequelize.INTEGER
            },
            memberId: {
                type: Sequelize.INTEGER
            },
            voteId: {
                type: Sequelize.INTEGER
            }
        },
            {
                sequelize,
                modelName: 'memberVote',
                timestamps: true,
                freezeTableName: true,
                paranoid: true
            }
        );
    }


    static associate(models) {

        // this.fkParent = this.belongsTo(models.Meeting, {
        //     foreignKey: "meetId"
        // });
        // this.fkParent = this.belongsTo(models.Member, {

        //     foreignKey: "memberId"
        // });
        // this.fkParent = this.belongsTo(models.Vote, {

        //     foreignKey: "voteId"
        // });
        // this.fkCircle=this.belongsTo(models.Circle, {
        //   // as: "Circle",
        //   //   constraints:false
        //   foreignKey: "meetId"
        // });
        // this.fkMb=this.belongsTo(models.CircleMember {
        //   // as: "Circle",
        //   //   constraints:false
        //   foreignKey: "entityId"
        // });




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
module.exports = MemberVote;