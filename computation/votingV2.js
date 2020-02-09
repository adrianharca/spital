
//dis is where we cluster users together based on each others' prefs instead of most feasible options style like in voting.js

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


function main(circleId) {
    mbVotes = getMbVotes(circleId);
    var joints = [mbVotes.length];



    for (let i = 0; i < mbVotes.length; i++)
        joints[i] = [mbVotes.length];
    for (let j = 0; j < mbVotes.length; j++) {
        joints[i][j] = getMbIntersection(i, j)
    }
}