import { baiduTranslator } from '../../translators/baidu.js';

function init() {
  $("#from").focus();
}

async function translate() {
  const type = $("#selectbar").val();
  const text = $("#from").val().trim();

  function renderResult(result) {
    $("#to").val(result)
  }

  let from = ''
  let to = ''

  switch(type) {
    case "0": break;
    case "1": from = 'en'; to = 'zh'; break;
    case "2": from = 'zh'; to = 'en'; break;
    default:
      renderResult('ERROR:暂不支持该选项')
  }

  const isLicensed = await baiduTranslator.existsLicense()
  if (!isLicensed) {
    renderResult('ERROR:未激活翻译引擎');
    return
  }

  const res = await baiduTranslator.translate(text, from, to)
  if (res.result == 'error') {
    switch (res.code) {
      case 'InvalidLicense': renderResult('ERROR:授权激活信息无效'); break;
      case 'ResponseError': renderResult('ERROR:请求异常，请检查网络'); break;
      case 'RequestError': renderResult('ERROR:请求异常');break;
      default: console.log(res);renderResult('ERROR:翻译异常');break;
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
}

async function main() {
  init();
  $("#transform>i").click(function() {
    translate();
  });
  $("#from").keypress(function(e) {
    if(e.keyCode === 13) {
      translate();
    }
  })
}

await main()
