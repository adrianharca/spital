
const User=require('./User');
const Circle= require('./Circle');
const Member= require('./Member');
const Vote= require('./Vote');
console.log('associations.js ')
module.exports=  ()=>
{
  User.hasMany(Member, {
    as:"Member", 
    // foreignKey:"userId",
    // foreignKeyConstraint:true 
        constraints:false
  });

//   Member.associate = (models)=>
    Member.belongsTo(User,{
      as:"User", 
    //   constraints:false
      foreignKey:"userid"
    });
  


//   Circle.associate = (models)=>
  Circle.belongsTo(User,{
    as:"Initiator",
    // targetKey: "initiatorid"
    foreignKey:"initiatorid"
    // constraints:false
  });

// User.associate =(models)=>
User.hasMany(Circle,{
  as:'Initiator',
//   foreignKey: "initiatorid",
//     foreignKeyConstraint:true 
    constraints:false
});



// Member.associate = (models)=> 
    Member.belongsTo(Circle,{
      as:"Circle", 
    //   constraints:false
    foreignKey:"circleId"
    });

 
//   Circle.associate = (models) => 
  Circle.hasMany(Member, {
    as: "Member", 
        constraints:false
    // foreignKey: "circleId",
    // foreignKeyConstraint:true 

  });




// Vote.associate = (models) => 
    Vote.belongsTo(Member,{
      as:"Member", 
    //   constraints:false
    foreignKey:"memberId"
    });
    // Member.associate = (models) =>
Member.hasMany(Vote,{
    as:"Options",
    constraints:false
    // foreignKey:'memberId',
    // foreignKeyConstraint:true 

});


//   Vote.associate = (models) => 
    Vote.belongsTo(Circle,{
      as:"Circle",
  
    //    foreignKey:"circleId"
    foreignKey:"circleId"
    });

// Circle.associate = (models) => 
  Circle.hasMany(Vote, {
    as: "Options",
        constraints:false
    // foreignKey: "circleId",
    // foreignKeyConstraint:true 
  });
  console.log('assocations r made')
}
