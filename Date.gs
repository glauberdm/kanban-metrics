function getWeekRange(start, end) {
  return dateRange(startDate, endDate).map(function (date) {
    return new Date(date).getYearWeek();
  }).unique();
}

function getDaysInBetween(start, end) {
  var period = [];
  for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
    period.push(new Date(d));
  }
  return period;
}
