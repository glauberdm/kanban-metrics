function generateThroughputChart(formObject) {
  var startDate = new Date(formObject.StartDate);
  var endDate = new Date(formObject.EndDate);
  var throughputSheet = "Throughput";
  var tasksSheet = formObject.TasksSheet;
  
  var spreadsheet = SpreadsheetApp.getActive();
  var tasksSheet = spreadsheet.getSheetByName(tasksSheet);
  
  if (throughputSheet == tasksSheet) {
    addError("The 'Throughput' sheet should be different from your 'Tasks' sheet. Please don't destroy your spreadsheet.");
    return;
  }
    
  Logger.log('Initializing \'Throughput\'');
  
  var tasksEnd = valuesForColumn(9, tasksSheet).sort();
  var demandType = valuesForColumn(10, tasksSheet);
  
  if (tasksEnd.length != demandType.length) {
    addError("For some reason we are dealing with columns with different sizes: Done - " + tasksStart.length + ", Demand Type - " + tasksType.length + "." );
    return;
  }
 
  var weekRange = getWeekRange(startDate, endDate);
  
  var tasks = Board.tasks(Filter.InsideWeekRange("Start Analysis", weekRange));
    
  var throughputCount = weekRange.map(function (week) {
    Logger.log(week);
    return [
      week, 
      tasks.filter(function (task) { 
        return week == new Date(task["Start Analysis"]).getYearWeek() && task["Type"] == "Valor"; 
      }).length,
      tasks.filter(function (task) { 
        return week == new Date(task["Start Analysis"]).getYearWeek() && task["Type"] == "Falha"; 
      }).length
    ];
  });
  
  var throughputSheet = getSheet(throughputSheet);
  
  var throughputRange = throughputSheet.getRange(1, 1, throughputCount.length + 1, throughputCount[0].length);
  throughputRange.setValues([["Week", "Valor", "Falha"]].concat(throughputCount));
  
  var valueFailureChart = throughputSheet.newChart().asLineChart()
    .setChartType(Charts.ChartType.LINE)
    .setTitle('Throughput')
    .setColors(['green', 'red'])
    .addRange(throughputRange)
    .setPosition(1, 1, 0, 0)
    .setOption('areaOpacity', 1.0)
    .setOption('height', 600)
    .setOption('width', 1000)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('pointSize', 5)
    .build();
    
  throughputSheet.insertChart(valueFailureChart);
  
  SpreadsheetApp.flush();
}


