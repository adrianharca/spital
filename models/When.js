function When(c) {
  var when = {};
  if (c != null) {
    if (c.date != undefined) {
      if (!isNaN(c.date))
        when.date = new Date(parseInt(c.date, 10));
      else
        when.date = new Date(c.date);
    }
    if (c.endDate != undefined) {
      if (!isNaN(c.date))
        when.endDate = new Date(parseInt(c.endDate, 10));
      else
        when.endDate = new Date(c.endDate);
    }
    when.timeOfDay = c.timeofday;
    when.isFlexible = c.isFlexible;
  }
  return when;
};
//returns 0-1 , 1 if same, w2 is required a single place not an area.
module.exports.distanceByTime = function distanceByTime(w1, w2) {
  const voteTime = w2.date != undefined ? w2.date : w2;
  const prefTime = w1.date != undefined ? w1.date : w1;
  if (w1.endDate != undefined && w1.endDate != null)
    if (isBetween(voteTime, w1.date, w1.endDate))
      return 1;
  return 1 / hoursBetween(prefTime, voteTime) == 0 ? 1 : hoursBetween(prefTime, voteTime);
  //TODO:deal with timeofday
};


function hoursBetween(date1, date2) {
  return Math.abs(Math.floor((date1 - date2) / (60000 * 24)));
};
function isBetween(voteTime, date, endDate) {
  return (voteTime > date && voteTime < endDate);
};
//returns an array of the most specific of 2 votes
module.exports.moreSpecificByTime = function moreSpecific(v1, v2) {
  var firstIsFixd = v1.endDate != undefined && v1.endDate != null;//if first is range
  var secondIsFixd = v2.endDate != undefined && v2.endDate != null;//if second is range
  if (!firstIsFixd && !secondIsFixd)    //both range
    return [];

  if (firstIsFixd && !secondIsFixd)
    return [v1];
  if (!firstIsFixd && secondIsFixd)
    return [v2];
  return [v1, v2];
};
module.exports.isTimeRange = function (w) {
  return (w.endDate != undefined && w.endDate != null);

}
module.exports.whenConstructor = (c) => {
  if (c.date != undefined) {
    this.date = new Date(parseInt(c.date, 10));
    /*
    if (this.date==null){
        this.date = new Date(c.date);
    }*/
  }
  if (c.endDate != undefined) {
    this.endDate = new Date(parseInt(c.endDate, 10));
    // this.endDate = Date.parse(c.endDate);
  }
  this.timeOfDay = c.timeofday;
};
module.exports.When = When;