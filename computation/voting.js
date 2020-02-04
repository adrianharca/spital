var When = require('../models/When');
var Where = require('../models/Where');
var Member = require('../models/Member');


//this function calculates a vector of prob/dimension 
//              can extend to include such things as user preferences,
//                                                  other members' preferences 
function Participrobability(distanceByLocation, distanceByTime, distanceByCrowding) {
    this.locDistance = 1 / distanceByLocation;// remove one after implementing normalization in responsible fcts
    this.timeDistance = distanceByTime;
    this.crowdDistance = 1 / distanceByCrowding;
};

//this needs to look at the options of others
function calcCrowdDist(v, p) {
    //get avg(pplNo) from all mebs that align with each  
    return 1;
};

//turns each mb vote into a vector of distances by comparing with one vote
const calculateDistances = (vote, preferences) => {
    var ret;
    if (Array.isArray(preferences)) {
        ret = [];
        preferences.forEach(
            p => ret.push(
                (vote, calculateDistances(vote, p))));
    }
    else
        ret = new Participrobability(
            When.distanceByTime(vote, preferences),
            Where.spaceDistances(vote, preferences),
            calcCrowdDist(vote, preferences));
    return ret;
};
// get best fitting votes
function calcBestMatchForVoteComparisons(probvect) {
    if (Array.isArray(probvect)) {

        var max = 0;//can be substituted by threshold 
        var best; //may return array if we find equal best scores
        for (let index = 0; index < array.length; index++) {
            const p = probvect[index];

            if ((p.locDistance + p.timeDistance) > max) {
                max = p.locDistance + p.timeDistance;
                best = p;
            }

        }
        return max;
    }
    return probvect.locDistance + probvect.timeDistance;
};


//create (member,votes) pairs
function MemberVote(mb, votes) {
    this.mb = mb;
    this.votes = votes.slice(0, votes.length);
    return mbVote;
}


//get a list of (member, votes) pairs for given circle
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

//find best match of two users' preferences
function getMbIntersection(i, j) {
    var intersect = [];
    var v1 = mbVotes[i].votes;
    var v2 = mbVotes[j].votes;
    for (let i = 0; i < v1.length; i++) {
        for (let j = 0; j < v2.length; j++) {
            if (matches(v1, v2))
                intersect.push(When.moreSpecificByTime(v1, v2));

        }
    }
};
function matches(v1, v2) {
    return new Participrobability(
        Where.spaceDistance(new Where(v1), new Where(v2)),
        When.distanceByTime(new When(v1), new When(v2)), 0);
}
//calc unique & specific votes for each mbm[mb.id][v]
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
//foreach vote calculate mb participation chances
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