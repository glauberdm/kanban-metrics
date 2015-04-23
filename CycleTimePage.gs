<div class="demo" >
  <style type="text/css"> 
    .demo { margin: 30px ; color : #AAA ; font-family : arial sans-serif ;font-size : 10pt } 
    p { color : red ; font-size : 14pt } 
    .datepicker {width: 60pt}
  </style>
  
  <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/cupertino/jquery-ui.css">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
  <script>
    function onFailure(error) {
      alert(error.message);
    }
    
    function onSuccess() {
      alert('Sucesso');
    }
  </script>
  
  <form id="myForm">
  
    <table>
      <tr>
        <td>
          Start Date
        </td>
        <td>
          End Date
        </td>
      </tr>
      <tr>
        <td>
          <input class="datepicker" type="text" name="StartDate"/>
        </td>
        <td>
          <input class="datepicker" type="text" name="EndDate"/>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          Tasks Sheet
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <input type="text" name="TasksSheet" value="Tasks"/>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          Value x Failure Demand Sheet
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <input type="text" name="ValueFailureSheet" value="Value x Failure"/>
        </td>
      </tr>
    </table>
    
    <br/>
    
    <button type="button" onclick="google.script.run.withFailureHandler(onFailure).generateCycleTime(this.parentNode)">Generate</button>
  
  </form>
  
  <script>
    $(".datepicker").datepicker({
      showWeek: true,
      firstDay: 1,
    });
  </script>
</div>
