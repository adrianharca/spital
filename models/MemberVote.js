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
    } static associate(models) {

        // this.fkMeeting=this.belongsTo(models.Meeting, {
        //   // as: "Meeting",
        //   //   constraints:false
        //   foreignKey: "meetId"
        // });
        // this.fkMb=this.belongsTo(models.MeetingMember {
        //   // as: "Meeting",
        //   //   constraints:false
        //   foreignKey: "entityId"
        // });




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
module.exports = MemberVote;