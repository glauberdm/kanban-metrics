function generateCycleTime(formObject) {
  var startDate = new Date(formObject.StartDate);
  var endDate = new Date(formObject.EndDate);
  var cycleTimeSheet = "Cycle Time";
  var tasksSheet = formObject.TasksSheet;
  var types = ["P", "M", "G"];
  var holidays = [new Date(2015, 2, 16), new Date(2015, 2, 17), new Date(2015, 2, 18)]
  
  var spreadsheet = SpreadsheetApp.getActive();
  var tasksSheet = spreadsheet.getSheetByName(tasksSheet);
  
  if (cycleTimeSheet == tasksSheet) {
    addError("The 'Cycle Time' sheet should be different from your 'Tasks' sheet. Please don't destroy your spreadsheet.");
    return;
  }
  
  if (tasksSheet === null) {
    addError("Sheet '" + tasksSheet + "' does not exist. Please specify a new one or use the default 'Tasks' sheet.");
    return;
  }
  
  Logger.log('Initializing \'Cycle Time\'');
  
  var tasksStart = valuesFor('analysis', tasksSheet);
  var tasksEnd = valuesFor('done', tasksSheet);
  var demandType = valuesForColumn(10, tasksSheet);
  var estimations = valuesForColumn(3, tasksSheet);
  
  if (tasksStart.length != tasksEnd.length) {
    addError("For some reason we are dealing with columns with different sizes: Start Analysis - " + tasksStart.length + ", Done - " + tasksEnd.length + "." );
    return;
  }
  
  if (demandType.length != estimations.length) {
    addError("For some reason we are dealing with columns with different sizes: Demand Type - " + demandType.length + ", Estimation - " + estimations.length + "." );
    return;
  }
  
  if (tasksStart.length != estimations.length) {
    addError("For some reason we are dealing with columns with different sizes: Start Analysis - " + tasksStart.length + ", Estimation - " + estimations.length + "." );
    return;
  }
  
  Logger.log("Calculating range of dates.");
  
  var failureCycleTime = [[0],["P"],["M"],["G"]];
  
  var valueCycleTimes = [[0],["P"],["M"],["G"]];
  
  for(var i = 0; i < tasksStart.length; i++) {
    var ct = new Date(tasksStart[i]).daysInBetween(new Date(tasksEnd[i]));

    if(demandType[i] == "Valor"){
      valueCycleTimes[0].push(1);
      switch (estimations[i][0]) {
        case "P":
          valueCycleTimes[1].push(ct);
          valueCycleTimes[2].push("");
          valueCycleTimes[3].push("");
        break;
        case "M":
          valueCycleTimes[1].push("");
          valueCycleTimes[2].push(ct);
          valueCycleTimes[3].push("");
        break;
        case "G":
          valueCycleTimes[1].push("");
          valueCycleTimes[2].push("");
          valueCycleTimes[3].push(ct);
        break;
      }    
    } else if(demandType[i] == "Falha"){
      failureCycleTime[0].push(1);
      switch (estimations[i][0]) {
        case "P":
          failureCycleTime[1].push(ct);
          failureCycleTime[2].push("");
          failureCycleTime[3].push("");
        break;
        case "M":
          failureCycleTime[1].push("");
          failureCycleTime[2].push(ct);
          failureCycleTime[3].push("");
        break;
        case "G":
          failureCycleTime[1].push("");
          failureCycleTime[2].push("");
          failureCycleTime[3].push(ct);
        break;
      }    
    }
  }   
  
  valueCycleTimes[0] = valueCycleTimes[0].sumPrevious();
  failureCycleTime[0] = failureCycleTime[0].sumPrevious();
  
  valueCycleTimes = transpose(valueCycleTimes);
  failureCycleTime = transpose(failureCycleTime);
  
  var cycleTimeSheet = getSheet(cycleTimeSheet);
  
  var valueCycleTimeRange = cycleTimeSheet.getRange(1, 1, valueCycleTimes.length, valueCycleTimes[0].length);
  valueCycleTimeRange.setValues(valueCycleTimes);
  cycleTimeSheet.getRange(1,1,1,valueCycleTimeRange.getLastColumn()).setNumberFormat('@STRING@');

  
  var failureCycleTimeRange = cycleTimeSheet.getRange(valueCycleTimes.length + 2, 1, failureCycleTime.length, failureCycleTime[0].length);
  failureCycleTimeRange.setValues(failureCycleTime);
  cycleTimeSheet.getRange(valueCycleTimes.length + 2,1,1,failureCycleTimeRange.getLastColumn()).setNumberFormat('@STRING@');
     
  var valueChart = cycleTimeSheet.newChart().asScatterChart()
    .setChartType(Charts.ChartType.SCATTER)
    .setTitle('Cycle Time - Value')
    .setColors(['green', 'red', 'blue'])
    .addRange(valueCycleTimeRange)
    .setPosition(1, 1, 0, 0)
    .setOption('areaOpacity', 1.0)
    .setOption('height', 600)
    .setOption('width', 1000)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('pointSize', 5)
    .build();
    
  var failureChart = cycleTimeSheet.newChart().asScatterChart()
    .setChartType(Charts.ChartType.SCATTER)
    .setTitle('Cycle Time - Failure')
    .setColors(['green', 'red', 'blue'])
    .addRange(failureCycleTimeRange)
    .setPosition(30, 1, 0, 0)
    .setOption('areaOpacity', 1.0)
    .setOption('height', 600)
    .setOption('width', 1000)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('pointSize', 5)
    .build();
    
  cycleTimeSheet.insertChart(valueChart);
  cycleTimeSheet.insertChart(failureChart);
  
  SpreadsheetApp.flush();
}

function CycleTime(start, estimation, cycleTime) {
  this.start = start;
  this.estimation = estimation;
  this.cycleTime = cycleTime;
}


