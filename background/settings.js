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
  setProperty(obj) {
    obj = obj ?? {}
    return syncStorage.get('settings').then(res => {
      return mergeDeep(res, obj)
    }).then(res => {
      return syncStorage.set({settings: res})
    }).then(() => {
      return {result: 'ok'}
    })
  }
  getProperty(k) {
    return syncStorage.get('settings').then(res => {
      if (res) {
        return res[k] || {}
      }
      return {result: 'ok',  data: {}}
    }).then(res => {
      return {result: 'ok', data: res}
    })
  }
}

var settings = new Settings()


function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}