class ProxyTranslator {
  constructor() {
    this.service = 'http://localhost:8888'
    this.api = {
      activate: '/license/activate',
      licenseInfo: '/license/detail/num',
      commonTrans: '/translate/commontrans'
    }

    this.loadCID = this.loadCID.bind(this)
  }
  loadCID() {
    if (this.cid) {
      return Promise.resolve(this.cid)
    }
    return syncStorage.get('cid').then(cid => {
      this.cid = cid
      return cid
    })
  }
  /**
   * Get the current actived license info
   */
  currentLicense() {
    return syncStorage.get('license').then(res => {
      if (res) {
        return {result: 'ok', data: res}
      } else {
        return {result: 'error', code: 'CacheNotExists', msg: 'cannot find active license'}
      }
    })
  }
  /**
   * Get license info by card number from proxy translate serivce
   * @param {String} license 
   */
  licenseInfo(license) {
    const api = this.service + this.api.licenseInfo + '?n=' + license
    return axios({
      method: 'get',
      url: api,
    }).then(res => {
      if (res.data.result == 'ok') {
        res = res.data
        return {result: 'ok', data: res.data}
      } else {
        return {result: 'error', code: 'Unknown', msg: 'unknown error'}
      }
    }).catch(err => {
      return {result: 'error', code: 'ResponseError', msg: err.response.data.message}
    })
  }
  /**
   * Activate proxy translate service by card number and secret
   * @param {String} license 
   * @param {String} secret 
   */
  activate(license, secret) {
    return this.loadCID().then(cid => {
      if (!cid) return {result: 'error', code: 'InitialError'}
      const api = this.service + this.api.activate
      const nonceStr = nonce(8)
      const clientID = cid
      const sign = md5(license+secret+nonceStr+clientID)
      const params = {
        n: license,
        c: clientID,
        s: nonceStr,
        si: sign,
      }
      return axios({
        method: 'post',
        url: api,
        data: params,
      }).then(res => {
        if (res.data.result == 'ok') {
          const license = res.data.data
          license.secret = secret
          return syncStorage.set({license}).then(() => {
            // activate success
            return {result: 'ok'}
          })
        } else {
          // activate failed
          return {result: 'error', code: 'UnknownError'}
        }
      }).catch(err => {
        // activate failed
        return {result: 'error', code: 'ResponseError', msg: err.response.data.message}
      })
    })
  }
  /**
   * Translate
   * @param {String} q 
   */
  translate(q) {
    return this.loadCID().then(cid => {
      if (!cid) return {result: 'error', code: 'InitialError'}
      return syncStorage.get('license').then(data => {
        if (!data) {
          return {result: 'error', code: 'InvalidLicense'}
        }
        const appID = data.appid
        const secret = data.secret
        const clientID = cid
        const salt = nonce(10)
        const sign = md5(appID+q+salt+secret)

        const params = {
          cid: clientID,
          sign: sign,
          q: q,
          salt: salt,
        }

        return axios({
          method: 'get',
          url: this.service + this.api.commonTrans + '?' + buildQuery(params)
        }).then(res => {
          if (res.data.result == 'ok') {
            return res.data
          } else {
            return {result: 'error', code: 'Unknown', msg: ''}
          }
        })
      }).then(res => {
        return res
      }).catch(err => {
        return {result: 'error', code: 'ResponseError', msg: err.response}
      })
    })
  }
}

function nonce(len) {
  const base = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ1234567890';
  let str = '';
  for (let i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * base.length);
    str += base[rand];
  }
  return str;
}

function buildQuery(params) {
  let qs = ''
  for (let k in params) {
    qs += (k + '=' + params[k] + '&')
  }
  return qs.substring(0, qs.length-1)
}

var proxyTranslator = new ProxyTranslator()