import { settings } from '../../background/settings.js'
import { proxyTranslator, baiduTranslator } from '../../background/translator.js'

$(function() {
  function init() {
    $("#from").focus();
  }

  function doTranslate() {
    var type = $("#selectbar").val();
    var text = $("#from").val();

    function renderResult(result) {
      $("#to").val(result)
    }
    settings.get('engine').then(res => {
      var currentEngine = 'proxy'
      if (res && res.result === 'ok') {
        currentEngine = res.data
      }
      return currentEngine == 'proxy' ? proxyTranslator : baiduTranslator
    }).then(engine => {
      switch(type) {
        case "0": 
          engine.translate(text).then(res => {
            console.log(res)
            if (res.result == 'error') {
              switch (res.code) {
                case 'InvalidLicense': renderResult('ERROR:授权激活信息无效'); break;
                case 'ResponseError': renderResult('ERROR:请求异常，请检查网络'); break;
                case 'RequestError': renderResult('ERROR:请求异常');break;
                default: renderResult('ERROR:翻译异常');break;
              }
              return
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
    })
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

