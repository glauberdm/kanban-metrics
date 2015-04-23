function getSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.getActive();
  var newSheet = spreadsheet.getSheetByName(sheetName);
  if (newSheet) {
    newSheet.clear();
    //    for(var chart in newSheet.getCharts()) {
    //      newSheet.removeChart(newSheet.getCharts()[chart]);
    //    }
    newSheet.activate();
    Logger.log("Resetting " + sheetName + " sheet");
  } else {
    newSheet = spreadsheet.insertSheet(sheetName, spreadsheet.getNumSheets());
    Logger.log("Creating " + sheetName + " sheet");
  }
  return newSheet;
}

function addError(error) {
  Logger.log("Adding error: " + error);
  Browser.msgBox(error);
  var errorSheet = getSheet('Errors');
  errorSheet.hideSheet();
  var lastRow = errorSheet.getLastRow();
  var cell = errorSheet.getRange('A1');
  cell.offset(lastRow, 0).setValue(error.message);
  cell.offset(lastRow, 1).setValue(error.fileName);
  cell.offset(lastRow, 2).setValue(error.lineNumber);
}

function transpose(a) {
  return Object.keys(a[0]).map(
    function (c) { return a.map(function (r) { return r[c]; }); }
  );
}

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

Date.prototype.getYearWeek = function() {
  return (parseInt(this.getFullYear()) * 100) + this.getWeek();
}

Date.prototype.daysInBetween = function(other) {
  return Math.ceil(Math.abs(other.getTime() - this.getTime()) / (1000 * 3600 * 24)); 
}

Array.prototype.unique = function() {
  return this.reduce(function(accum, current) {
    if (accum.indexOf(current) < 0) {
      accum.push(current);
    }
    return accum;
  }, []);
}

Array.prototype.sumPrevious = function() {
  for (var i = 0; i < this.length; i++) {
    this[i] = (i==0 ? 0 : this[i-1]) + this[i];
  }
  return this;
}

Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

function valuesForColumn(columnNumber, tasksSheet) {
  Logger.log('Retrieving values from column ' + columnNumber);
  return tasksSheet.getRange(2, columnNumber, tasksSheet.getLastRow()).getValues();
}

function countTasks(as, bs, condition) {
  return as.map(function (a) {
    return bs.filter(function (b) {
      return condition(a,b);
    }).length;
  });
}

