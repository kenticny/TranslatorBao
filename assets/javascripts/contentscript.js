chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
  var showResult = "";
  var transResult = request.message["trans_result"];
  if(transResult.length == 0) {
    showResult = "没有找到合适的解释";
  }
  for(var i = 0; i < transResult.length; i++) {
    showResult += "<li>" + transResult[i].dst + "</li>";
  }
  if($("#translatebao").length > 0) {
    $("#translatebao").remove();
  }
  $("body").append("<div id='translatebao' style='position:absolute;top:100px;right:100px;background:#000;color:#fff;padding:10px;'>" + showResult + "</div>");
});