function When(c) {
  if (c.date != undefined)
    this.date = Date.parse(c.date);
  if (c.endDate != undefined)
    this.endDate = Date.parse(c.endDate);
  if (c.timeOfDay != undefined)
    this.timeofday = c.timeOfDay;
};
//returns 0-1 , 1 if same, w2 is required a single place not an area.
module.exports.distanceByTime = function distanceByTime(w1, w2) {
  const voteTime = w2.date;
  if (w1.endDate != undefined && w1.endDate != null)
    if (isBetween(voteTime, w1.date, w1.endDate))
      return 1;
    else return 1 / hoursBetween(w1.date, voteTime);
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
module.exports.When = When;