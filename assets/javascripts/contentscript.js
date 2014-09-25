chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
  console.log(request.message);
  if(request.cmd== "mycmd") 
    sendResponse("ok"); 
});