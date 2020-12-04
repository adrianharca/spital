var MemberVote = require("../models/MemberVote");

exports.addMemberVote = function (req, res){
    console.log("add memberVote - " + JSON.stringify(req.body));
    let{meetId, memberId, voteId} = req.body;

    MemberVote.create({meetId: meetId, memberId: memberId, voteId: voteId})
       .then(a => {
           console.log("created MemberVote: " + a.id)
            res.json(a.id);
        })
        .catch(err => console.log(err)); 
};