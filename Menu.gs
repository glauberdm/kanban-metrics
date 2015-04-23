function onOpen() {
  var items = [
    {name: 'CFD', functionName: 'customizeCFD'},
    {name: 'Value x Failure Demand', functionName: 'customizeValueFailure'},
    {name: 'Cycle Time', functionName: 'customizeCycleTime'},
    {name: 'Throughput', functionName: 'customizeThroughput'}
  ];
  SpreadsheetApp.getActive().addMenu('Kanban', items);
}

function debugSheets() {
  Logger.log(opts);
}

function customizeCFD() {
  var html = HtmlService.createHtmlOutputFromFile('CFDPage')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Customize your Cumulative Flow Diagram')
    .setWidth(500);
  var app = SpreadsheetApp.getUi()
  app.showSidebar(html);
}

function customizeValueFailure() {
  var html = HtmlService.createHtmlOutputFromFile('ValueFailurePage')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Customize your Value x Failure Demand Charts')
    .setWidth(500);
  SpreadsheetApp.getUi() 
    .showSidebar(html);
}

function customizeCycleTime() {
  var html = HtmlService.createHtmlOutputFromFile('CycleTimePage')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Customize your Cycle Time Charts')
    .setWidth(500);
  SpreadsheetApp.getUi() 
    .showSidebar(html);
}

function customizeThroughput() {
  var html = HtmlService.createHtmlOutputFromFile('ThroughputPage')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Customize your Throughtput Charts')
    .setWidth(500);
  SpreadsheetApp.getUi() 
    .showSidebar(html);
}

function valuesForCFD(stepName, tasksSheet) {
  Logger.log('Retrieving dates from ' + stepName);
  var analysisRange = tasksSheet.getRange(2, WorkflowDefinition.step(stepName).start, tasksSheet.getLastRow());
  var values = analysisRange.getValues();
  values.sort(function(a,b){
    return new Date(a).getTime() - new Date(b).getTime();
  });
  return values;
}

function valuesFor(stepName, tasksSheet) {
  Logger.log('Retrieving dates from ' + stepName);
  var analysisRange = tasksSheet.getRange(2, WorkflowDefinition.step(stepName).start, tasksSheet.getLastRow());
  return analysisRange.getValues();
}

function countTasksCFD(dates, stepDates) {
  var counts = dates.map(function (date) {
    return stepDates.filter(function (stepDate) {
      return new Date(date).getTime() >= new Date(stepDate).getTime();
    }).length;
  });
  return counts;
}

