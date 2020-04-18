class Settings {
  set(k, v) {
    return syncStorage.get('settings').then(res => {
      if (!res) {
        res = {}
      }
      res[k] = v
      return res
    }).then(res => {
      return syncStorage.set({settings: res})
    }).then(() => {
      return {result: 'ok'}
    })
  }
  get(k) {
    return syncStorage.get('settings').then(res => {
      if (res) {
        return res[k] || null
      }
      return null
    }).then(res => {
      return {result: 'ok', data: res}
    })
  }
}

var settings = new Settings()
