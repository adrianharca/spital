
// const User = require('./User');
// const Meeting = require('./Meeting');
// const Member = require('./Member');
// const Vote = require('./Vote');
// console.log('associations.js ')
// module.exports = () => {

//   //   Member.associate = (models)=>
//   Member.belongsTo(User, {
//     as: "User",
//     //   constraints:false
//     foreignKey: "userid"
//   });



//   //   Meeting.associate = (models)=>
//   Meeting.belongsTo(Member, {
//     as: "Initiator",
//     // targetKey: "initiatorid"
//     foreignKey: "initiatorid"
//     // constraints:false
//   });

//   // User.associate =(models)=>
//   Meeting.hasOne(Member, {
//     as: 'Initiator',
//       foreignKey: "initiatorid",
//     //     foreignKeyConstraint:true 
//     // constraints: false
//   });



//   // Member.associate = (models)=> 
//   Member.belongsTo(Meeting, {
//     as: "Meeting",
//     //   constraints:false
//     foreignKey: "meetingId"
//   });


//   //   Meeting.associate = (models) => 
//   Meeting.hasMany(Member, {
//     as: "Member",
//     constraints: false
//     // foreignKey: "meetingId",
//     // foreignKeyConstraint:true 

//   });




//   // Vote.associate = (models) => 
//   Vote.belongsTo(Member, {
//     as: "Member",
//     //   constraints:false
//     foreignKey: "memberId"
//   });
//   // Member.associate = (models) =>
//   Member.hasMany(Vote, {
//     as: "Options",
//     constraints: false
//     // foreignKey:'memberId',
//     // foreignKeyConstraint:true 

//   });


//   //   Vote.associate = (models) => 
//   Vote.belongsTo(Meeting, {
//     as: "Meeting",

//     //    foreignKey:"meetingId"
//     foreignKey: "meetingId"
//   });

//   // Meeting.associate = (models) => 
//   Meeting.hasMany(Vote, {
//     as: "Options",
//     constraints: false
//     // foreignKey: "meetingId",
//     // foreignKeyConstraint:true 
//   });

//   // Meeting.belongsToMany(User, {through: 'Member'});
//   // User.belongsToMany(Meeting,{through:'Member'});


//   console.log('assocations r made')
// }
