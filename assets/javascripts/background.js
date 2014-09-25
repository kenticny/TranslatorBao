// on click event
function onClickHandler(info, tab) {
  if(info.menuItemId == "translate-selection") {
    var text = info.selectionText;
    $.get("http://openapi.baidu.com/public/2.0/bmt/translate?client_id=z5OMaOk2GlfGj29UFP9siA6Y&q=today&from=auto&to=auto", 
      function(result) {
      //console.log(result);
    });
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
    chrome.tabs.sendMessage(tabs[0].id, {message: "mycmd"}, function(response) {    
      console.log(response);
    }); 
  });
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({
  title: "Demo",
  contexts: ["selection"],
  id: "translate-selection"
});