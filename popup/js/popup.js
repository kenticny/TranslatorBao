$(function() {
  var BG = chrome.extension.getBackgroundPage();

  function init() {
    $("#from").focus();
  }

  function parseResult(message) {
    if(message.error_code && message.error_code == 52003) {
      chrome.storage.sync.clear(function(){});
      return 'Licence验证失败';
    }else if(message.error_msg) {
      return message.error_msg;
    }
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

    function renderResult(result) {
      $("#to").val(result)
    }

    switch(type) {
      case "0": 
        BG.proxyTranslator.translate(text).then(res => {
          if (res.result == 'error') {
            if (res.code == 'InvalidLicense') {
              return renderResult('ERROR:授权激活信息无效')
            }
          }
          if (res.result == 'ok') {
            const transResult = res.data["trans_result"];
            var showResult = "";
            if(transResult.length == 0) {
              showResult = "没有找到合适的解释";
            }
            for(var i = 0; i < transResult.length; i++) {
              showResult += transResult[i].dst + "\n";
            }
            return renderResult(showResult)
          }
          return renderResult('没有找到合适的解释')
        })
        break;
      default:
        renderResult('ERROR:暂不支持该选项')
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

