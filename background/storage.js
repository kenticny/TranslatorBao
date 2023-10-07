class Storage {
  constructor(type) {
    this.type = type
  }
  get(k) {
    return new Promise(resolve => {
      chrome.storage[this.type].get(k, data => {
        return resolve(data[k])
      })
    })
  }
  set(data) {
    return new Promise(resolve => {
      chrome.storage[this.type].set(data, () => {
        return resolve()
      })
    })
  }
}

var syncStorage = new Storage('sync')
var localStorage = new Storage('local')

export {
  syncStorage,
  localStorage
}