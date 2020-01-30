 function When(c) {
  if (c.date != undefined)
    this.date = Date.parse(c.date);
  if (c.endDate != undefined)
    this.endDate = Date.parse(c.endDate);
  if (c.timeOfDay != undefined)
    this.timeofday = c.timeOfDay;
};
module.exports=When;