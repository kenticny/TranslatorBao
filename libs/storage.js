class Storage {
  constructor(type) {
    this.type = type
  }
  async get(k) {
    return (await chrome.storage[this.type].get(k))[k]
  }
  async set(k, data) {
    return await chrome.storage[this.type].set({ [k]: data })
  }
}

export const syncStorage = new Storage('sync');
export const localStorage = new Storage('local');