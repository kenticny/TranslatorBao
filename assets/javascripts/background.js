// on click event
function onClickHandler(info, tab) {
  if(info.menuItemId == "translate") {
    var text = info.selectionText;
    translate.quickTranslate(text, function(result) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
        chrome.tabs.sendMessage(tabs[0].id, {message: result}, function(response) {    
          console.log(response);
        }); 
      });
    });
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({
  title: "TranslateBao",
  contexts: ["selection", "link"],
  id: "translate"
});
