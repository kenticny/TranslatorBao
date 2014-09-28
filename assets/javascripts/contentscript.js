function renderTemplate(result) {
  if($("#translatebao").length == 0) {
    $("body").append("<div id='translatebao'></div>");
  }
  $("#translatebao").html(result);
}

function show(callback) {
  $("#translatebao").show();
  callback();
}

function hide() {
  $("#translatebao").fadeOut("fast");
}

function autoHide(timer) {
  setTimeout(function() {
    hide();
  }, timer || 3000);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
  var showResult = "";
  var transResult = request.message["trans_result"];
  if(transResult.length == 0) {
    showResult = "没有找到合适的解释";
  }
  for(var i = 0; i < transResult.length; i++) {
    showResult += "<li>" + transResult[i].dst + "</li>";
  }
  renderTemplate(showResult);
  show(autoHide);
});