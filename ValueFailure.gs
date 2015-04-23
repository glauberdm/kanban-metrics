function generateValueFailureChart(formObject) {
  var startDate = new Date(formObject.StartDate);
  var endDate = new Date(formObject.EndDate);
  var valueFailureSheet = "Value x Failure";
  var tasksSheet = formObject.TasksSheet;
  var types = ["Valor", "Falha"];
  
  var spreadsheet = SpreadsheetApp.getActive();
  var tasksSheet = spreadsheet.getSheetByName(tasksSheet);
  
  if (valueFailureSheet == tasksSheet) {
    addError("The 'Value x Failure' sheet should be different from your 'Tasks' sheet. Please don't destroy your spreadsheet.");
    return;
  }
  
  if (tasksSheet === null) {
    addError("Sheet '" + tasksSheet + "' does not exist. Please specify a new one or use the default 'Tasks' sheet.");
    return;
  }
  
  Logger.log('Initializing \'Value Demand x Failure Demand\'');
  
  var tasksStart = valuesFor('analysis', tasksSheet);
  var tasksType = valuesForColumn(10, tasksSheet);
  
  if (tasksStart.length != tasksType.length) {
    addError("For some reason we are dealing with columns with different sizes: Start Analysis - " + tasksStart.length + ", Type - " + tasksType.length + "." );
    return;
  }
  
  Logger.log("Calculating range of dates.");
  
  var rangeDates = dateRange(startDate, endDate);
  var rangeWeeks = rangeDates.map(function (date) {
    return new Date(date).getYearWeek();
  }).unique();
  
  var counts = {};
  
  for (var i = 0; i < tasksStart.length; i++) {
    var taskStartDate = new Date(tasksStart[i]).getYearWeek();
    var taskType = tasksType[i];
    if (rangeWeeks.indexOf(taskStartDate) > -1) {
      counts[taskStartDate] = counts[taskStartDate] ? counts[taskStartDate] : {"week": taskStartDate, "value": 0, "failure": 0};
      if (taskType == "Valor") {
        counts[taskStartDate].value = counts[taskStartDate].value + 1;
      } else if (taskType == "Falha") {
        counts[taskStartDate].failure = counts[taskStartDate].failure + 1;      
      }
    }
  }
  
  var valueCount = [];
  var failureCount = [];
  
  for (var rangeWeek in rangeWeeks) {
    var week = rangeWeeks[rangeWeek];
    Logger.log(week);
    valueCount.push(counts[rangeWeeks[rangeWeek]] ? counts[rangeWeeks[rangeWeek]].value : 0);
    failureCount.push(counts[rangeWeeks[rangeWeek]] ? counts[rangeWeeks[rangeWeek]].failure : 0);
  }
  
  var valueFailure = [
    ['Week'].concat(rangeWeeks),
    ["Value"].concat(valueCount.sumPrevious()),
    ["Failure"].concat(failureCount.sumPrevious())
  ];
  
  valueFailure = transpose(valueFailure); 
 
  var valueFailureSheet = getSheet(valueFailureSheet);
  
  var valueFailureRange = valueFailureSheet.getRange(1, 1, valueFailure.length, valueFailure[0].length);
  valueFailureRange.setValues(valueFailure);
  
  var valueFailureChart = valueFailureSheet.newChart().asLineChart()
    .setChartType(Charts.ChartType.LINE)
    .setTitle('Value x Failure')
    .setColors(['green', 'red'])
    .addRange(valueFailureRange)
    .setPosition(1, 1, 0, 0)
    .setOption('areaOpacity', 1.0)
    .setOption('height', 600)
    .setOption('width', 1000)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('pointSize', 5)
    .build();
    
  valueFailureSheet.insertChart(valueFailureChart);
  
  SpreadsheetApp.flush();
}


