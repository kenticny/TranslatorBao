import { syncStorage } from './storage.js'

(function() {
  syncStorage.get('cid').then(cid => {
    if (!cid) {
      fetch('https://demo.service.mkicon.com/tools/uuid').then(res => {
        const cid = res.data.data.uuid
        syncStorage.set({cid}).then(noop)
      })
    }
  })

  chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
  });
})()

function noop() {
  return
}