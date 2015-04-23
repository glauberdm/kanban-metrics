var Filter = ( function () {
  return {
    InsideWeekRange : function (stepName, weekRange) {
      return function (task) {
        return weekRange.indexOf(new Date(task[stepName]).getYearWeek()) != -1;
      }
    },
    Equals : function (key, value) {
      return function (task) {
        return task[key] == value;
      };
    },
    AfterEquals : function (stepName, date) {
      return function (task) {
        return new Date(task[stepName]).getTime() >= new Date(date);
      }
    }
  };
})();

