$(function() {
  var BG = chrome.extension.getBackgroundPage();

  function init() {
    $("#from").focus();
  }

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

  function doTranslate() {
    var type = $("#selectbar").val();
    var text = $("#from").val();

    function resultHandle(result) {
      $("#to").val(parseResult(result));
    }

    switch(type) {
      case "0": 
        BG.translate.quickTranslate(text, resultHandle);
        break;
      case "1": 
        BG.translate.englishToChinese(text, resultHandle);
        break;
      case "2": 
        BG.translate.chineseToEnglish(text, resultHandle);
        break;
      default:
        BG.translate.quickTranslate(text, resultHandle);
    }
  }

  init();
  
  $("#transform>i").click(function() {
    doTranslate();
  });
  $("#from").keypress(function(e) {
    if(e.keyCode === 13) {
      doTranslate();
    }
  })
});

