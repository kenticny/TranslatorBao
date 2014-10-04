$(function() {
  var BG = chrome.extension.getBackgroundPage();

  function parseResult(message) {
    var transResult = message["trans_result"];
    var showResult = "";
    if(transResult.length == 0) {
      showResult = "没有找到合适的解释";
    }
    for(var i = 0; i < transResult.length; i++) {
      showResult += transResult[i].dst + "\n";
    }
    return showResult;
  }

  $("#transform>i").click(function() {
    var text = $("#from").val();
    BG.translate(text, function(result) {
      $("#to").val(parseResult(result))
    });
  });
});

