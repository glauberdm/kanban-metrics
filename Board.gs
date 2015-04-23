function BoardStep (name, column) {
  this.name = name;
  this.column = column;
}

function TaskClassification (name, column) {
  this.name = name;
  this.column = column;
}

function BoardConfiguration () {
  this.steps = [];
  this.classifications = [];
  
  this.addStep = function (stepName, stepColumn) {
    this.steps.push(new BoardStep(stepName, stepColumn));
  }
  
  this.addClassification = function (classificationName, classificationColumn) {
    this.classifications.push(new TaskClassification(classificationName, classificationColumn));
  }
}

var Board = (function () {
  var configuration;
  
  function createConfiguration() {
    var instance = new BoardConfiguration();
    instance.addStep("Start Analysis", 3);
    instance.addStep("End Analysis", 4);
    instance.addStep("Start Development", 5);
    instance.addStep("End Development", 6);
    instance.addStep("Start Testing", 7);
    instance.addStep("End Testing", 8);
    instance.addStep("Done", 8);
    instance.addClassification("Estimation", 2);
    instance.addClassification("Type", 9);
    return instance;
  }
  
  var getAllTasks = function () {
    var sheet = SpreadsheetApp.getActive().getSheetByName("Tasks");
    var range = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    
    var result = [];
    for(var row in range) {
      result.push(new Task(range[row]));
    }
    return result;
  }
  
  return {
    configuration: function () {
      if (!configuration) configuration = createConfiguration();
      return configuration;
    },
    allTasks: function () {
      return new Tasks(getAllTasks());
    },
    tasks: function () {
      var taskFilters = arguments;
      var result = getAllTasks();
      for(var taskFilter in taskFilters) {
        result = result.filter( function (task) {
          return taskFilters[taskFilter](task);
        });
      }
      return new Tasks(result);
    }
  };
})();

function Tasks(tasks) {
  this.tasks = tasks;
  
  this.count = function (key) {
    var count = {};
    this.tasks.forEach(function (task){
      count[task[key]] = count[task[key]] ? count[task[key]] + 1 : 1;
    });
    return count;
  }
  
  this.countAgainst = function (against, key) {
    var tasks = this.count(key);
    return against.map(function (a) {
      return tasks[a] ? tasks[a] : 0;
    });
  }
}

function Task (arr) {
  var values = {};
  var configurationValues = Board.configuration().steps.concat(Board.configuration().classifications);
  for (var i in configurationValues) {
    values[configurationValues[i].name] = arr[configurationValues[i].column];
  }
  return values;
}


