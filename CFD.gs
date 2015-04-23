function generateCFDChart(formObject) {
  var startDate = new Date(formObject.StartDate);
  var endDate = new Date(formObject.EndDate);
  var tasksSheet = formObject.TasksSheet;
  var cfdSheet = formObject.CFDSheet;
  
  var tasksSheet = SpreadsheetApp.getActive().getSheetByName(tasksSheet);
  
  if(cfdSheet == tasksSheet){
    addError("The CFD sheet should be different from your Tasks sheet. Please don't destroy your spreadsheet.");
    return;
  }
  
  if(tasksSheet === null) {
    addError("Tasks Sheet does not exist. Please specify a new one or use the default 'Tasks' sheet.");
    return;
  }
  
  tasksSheet.activate();
  
  var tasks = Board.tasks(Filter.AfterEquals("Done", startDate));
  var dates = getDaysInBetween(startDate, endDate);
  
  
  var countAfterEquals = function (key) {
    return dates.map(function (date) {
      return tasks.tasks.filter(function (task) {
        return new Date(task[key]).getTime() <= date.getTime();
      }).length;
    })
  };
  
  var analysisCount = countAfterEquals("Start Analysis");
  var developmentCount = countAfterEquals("Start Development");
  var testingCount = countAfterEquals("Start Testing");
  var doneCount = countAfterEquals("Done");
  
  var cfd = transpose(
    [
      ["Step"].concat(dates), 
      ["Analysis"].concat(analysisCount), 
      ["Development"].concat(developmentCount), 
      ["Testing"].concat(testingCount), 
      ["Done"].concat(doneCount)
    ]
  );
  
  var cfdSheet = getSheet(cfdSheet);
  
  var cfdRange = cfdSheet.getRange(1, 1, cfd.length, 5);
  cfdRange.setValues(cfd);
  
  var cfdChart = cfdSheet.newChart().asAreaChart()
  .setChartType(Charts.ChartType.AREA)
  .setTitle('Cumulative Flow Diagram')
  .setColors(['yellow', 'red', 'blue', 'green'])
  .addRange(cfdRange)
  .setPosition(1, 1, 0, 0)
  .setOption('areaOpacity', 1.0)
  .setOption('height', 600)
  .setOption('width', 1000)
  .build();
  
  cfdSheet.insertChart(cfdChart);
  
  SpreadsheetApp.flush();
}
