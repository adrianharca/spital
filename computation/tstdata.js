var alg = require('./voting');


var locsCluster1 = [
    {
        latitude: 37.44911631,
        longitude: 122.23172796
    }, {
        latitude: 37.41436821,
        longitude: - 122.18237636
    }, {
        latitude: 37.45515781,
        longitude: - 122.2434827
    }, {
        latitude: 37.4429484,
        longitude: - 122.21683557
    }, {
        latitude: 37.48078696,
        longitude: - 122.19557326
    }, {
        latitude: 37.45203432,
        longitude: - 122.19751847
    }, {
        latitude: 37.44188042,
        longitude: - 122.23479483
    }, {
        latitude: 37.40327012,
        longitude: - 122.18401481
    }
];
var locsCluster2 = [
    {
        latitude: 30.75275539,
        longitude: -116.21155592
    }, {
        latitude: 31.0186137,
        longitude: -116.27879038
    }, {
        latitude: 30.73715435,
        longitude: -115.71113469
    }, {
        latitude: 30.79896478,
        longitude: -116.3755292
    }, {
        latitude: 31.28320857,
        longitude: -116.23765363
    }, {
        latitude: 31.10785937,
        longitude: -115.52332486
    }, {
        latitude: 31.04694726,
        longitude: -116.34283737
    }, {
        latitude: 31.36832028,
        longitude: -115.72905304
    }
];
var allLocs = [...locsCluster1, ...locsCluster2];
function randomDate(date1, date2) {
    function randomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if (date1 > date2) {
        return new Date(randomValueBetween(date2, date1)).toLocaleDateString()
    } else {
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()

    }
}
var times = ['02/13/2020', '08/01/2020'];
function genMembersAndAssign(n, locations) {
    var mbs = [n];
    //build vote allocation matrix

    for (let index = 0; index < n; index++) {
        mbs[index] = {
            'name': 'mb' + (index + 1),
            'vote': generateVotes(
                getPartition(locations, index,
                    Math.floor(locations.length / n)))

        };

        var obj = {
            name: mbs[index].name,
            vote: JSON.stringify(mbs[index].vote)
        };
        //console.log(obj);
        //let's comment those logs
        // console.log(JSON.stringify(mbs[index]));
        // console.log(getPartition(locations, index,
        //     Math.floor(locations.length / n)));
        // console.log(mbs[index]);

    }
    return mbs;

};
function tracePrototypeChainOf(object) {

    var proto = object.constructor.prototype;
    var result = '';

    while (proto) {
        result += ' -> ' + proto.constructor.name;
        proto = Object.getPrototypeOf(proto)
    }

    return result;
}
var mbVotes = genMembersAndAssign(3, locsCluster1);
function generateVotes(locations) {
    var votes = [];//locations.length
    locations.forEach(element => {
        votes.push(new Vote(new Place(element), randomDate(...times)));
    });
    return votes;
};
function Vote(location, date) {
    this.location = new Place(location);
    this.date = date;
};
function Place(loc) {
    this.latitude = loc.latitude;
    this.longitude = loc.longitude;
}

function getPartition(toSplit, partNo, partSize) {
    return toSplit.reduce(toPartitions(partSize), [])[partNo];
};

function makeTimeSpacePairs(times, spaces) {
    return timeSpacePair = {
        date: [...times],
        location: [...spaces]
    };

}

//internet fct for partitioning arrays
// use like   locsCluster1.reduce(toPartitions(locsCluster1.length % n),[]);
function toPartitions(size) {
    var partition = [];
    return function (acc, v) {
        partition.push(v);
        if (partition.length === size) {
            acc.push(partition);
            partition = [];
        }
        return acc;
    };
}
const flatten = (arr) => arr.reduce((flat, next) => flat.concat(next), []);
var allvotes = flatten(
    mbVotes.map(a => a.vote)
);
var particimatrix = distmatrix(allvotes);
function distmatrix(av) {
    var temp = [];
    console.log('making vote matrix');
    av.map(v => {
       // console.log('vote' + JSON.stringify(v, null, 1));
        temp.push(v);
        mbVotes.map(mb => {
            temp[v] = new Object({ name: mb.name, probs: alg.calculateDistances(v, mb.vote) });
           // console.log(mb.name + ' ' + JSON.stringify(temp[v]['probs'], null, 1));
        })
    });
    return temp;
};
module.exports.distribution = mbVotes;
module.exports.probVects = particimatrix;