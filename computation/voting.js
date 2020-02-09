var When = require('../models/When');
var Where = require('../models/Where');
var Member = require('../models/Member');


//this function calculates a vector of prob/dimension 
//              can extend to include such things as user preferences,
//                                                  other members' preferences 
function Participrobability(distanceByLocation, distanceByTime, distanceByCrowding) {
    this.locDistance = 1 / distanceByLocation;// remove one after implementing normalization in responsible fcts
    this.timeDistance = distanceByTime;
    if (distanceByCrowding == undefined)
        this.distanceByCrowding = 1;
    else
        this.crowdDistance = 1 / distanceByCrowding;
};

//this needs to look at the options of others
function calcCrowdDist(v, p) {
    //get avg(pplNo) from all mebs that align with each  
    return 1;
};

//2 turns each mb's preferences into a vector of participrobabilities by comparison w one vote.
// to be run foreach mb against all fixed votes 
module.exports.calculateDistances = (vote, preferences) => {
    var ret;
    if (Array.isArray(preferences)) {
        ret = [];
        preferences.forEach(
            p => ret.push(
                (vote.id, this.calculateDistances(vote, p))));
    }
    else
        ret = matches(vote, preferences);

    // new Participrobability(
    //     When.distanceByTime(vote, preferences),
    //     Where.spaceDistances(vote, preferences),
    //     calcCrowdDist(vote, preferences));
    return ret;
};


//4 get the highest scoring match from one users matchvector
//[ rate of agreement with an option by prefs]
function calcBestMatchForVoteComparisons(probvect) {
    if (Array.isArray(probvect)) {

        var max = 0;//can be substituted by threshold 
        var best; //may return array if we find equal best scores
        for (let index = 0; index < array.length; index++) {
            const p = probvect[index];

            if ((p.locDistance + p.timeDistance) > max) {
                max = p.locDistance + p.timeDistance;
                best = index;
            }

        }
        return { max: max, best: best };
    }
    return probvect.locDistance + probvect.timeDistance;
};


// 1.1 create (member,votes) pairs
function MemberVote(mb, votes) {
    this.mb = mb;
    this.votes = votes.slice(0, votes.length);
    return mbVote;
}


//1. get a list of (member, votes) pairs for given circle
var mbVotes;
function getMbVotes(circleId) {
    var circId = Number(circleId);
    var membas = [];
    membas = Circle.findByPk(circId)
        .then(c => {
            if (c != null)
                c.getMembers()
        })
        .then(mbs => {
            mbs.forEach(mb => Vote.findAll({ where: { memberId: mb.id } }).
                then(vs => {
                    membas.push(MemberVote(mb, vs));
                })
            )
            console.log('members for circle ' + circleId + ' ');
            return membas;
        }).catch(e => console.log(e));

};


function matches(v1, v2) {
    return new Participrobability(
        Where.spaceDistance(v1.longitude != 'undefined' ? v1 : new Where.Where(v1),
            v2.longitude != 'undefined' ? v2 : new Where.Where(v2)),
        When.distanceByTime(new When.When(v1), new When.When(v2)));
}

//3determine the unique & specific votes for each mbm[mb.id][v]
function calcDistMatrix() {
    var mbVoteMatrix = [mbVotes.length];
    mbVotes.forEach(m => {
        mbVoteMatrix[m.mb.id] = [];
        m.votes.forEach(//foreach member determine most specific votes
            v => {
                if (!Where.isArea(new Where.Where(v).location) &&
                    !When.isTimeRange(new When.When(v)))//if v is specific
                    //make it a column
                    if (!isInMatrix(v, mbVoteMatrix))//check 
                        mbVoteMatrix[m.mb.id].push(v);
            }
        )
    }
    )

    return mbVoteMatrix;
};
//4 foreach vote calculate mb participation chances
function calcPostDist(mbVoteMatrix) {
    voteParticipationMatrix = [];
    mbVoteMatrix.forEach(element => {
        element.forEach(vote =>
            voteParticipationMatrix[vote.id][element] =
            calcBestMatchForVoteComparisons(calculateDistances(vote, mbVotes[element]))
        )
    });
}


function isInMatrix(elem, mat) {
    mat.forEach(
        row => row.forEach(
            column => {
                //todo: check == by location & time
                if (JSON.stringify(mat[row][column]) === JSON.stringify(elem))
                    return true;
            }
        )
    )
    return false;
};
//main 
function main(circleId) {
    mbVotes = getMbVotes(circleId);
    var joints = [mbVotes.length];



    for (let i = 0; i < mbVotes.length; i++)
        joints[i] = [mbVotes.length];
    for (let j = 0; j < mbVotes.length; j++) {
        joints[i][j] = getMbIntersection(i, j)
    }
}