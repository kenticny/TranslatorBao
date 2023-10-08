import { md5 } from './libs/md5.m.js'
import { syncStorage } from './storage.js'
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
    return fetch(api).then(response => response.json()).then(res => {
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
      return fetch(api, {
        method: 'post',
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(response => response.json()).then(res => {
        if (res.data.result == 'ok') {
          const proxyLicense = res.data.data
          proxyLicense.secret = secret
          return syncStorage.set({proxyLicense}).then(() => {
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
  translate(q, from, to) {
    return this.loadCID().then(cid => {
      if (!cid) return {result: 'error', code: 'InitialError'}
      return syncStorage.get('proxyLicense').then(data => {
        if (!data) {
          return {result: 'error', code: 'InvalidLicense'}
        }
        const appID = data.appid
        const secret = data.secret
        const clientID = cid
        const salt = nonce(10)
        const sign = md5(appID+q+salt+secret)

        const pre = preTranslate(q, from, to)
        q = pre.q
        from = pre.from
        to = pre.to

        const params = {
          cid: clientID,
          sign: sign,
          q: q,
          salt: salt,
          from: from,
          to: to,
        }

        return fetch(this.service + this.api.commonTrans + '?' + buildQuery(params)).then(response => response.json()).then(res => {
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

class BaiduTranslator {
  constructor() {
    this.service = 'https://fanyi-api.baidu.com'
    this.api = {
      commonTrans: '/api/trans/vip/translate'
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
  existsLicense() {
    return syncStorage.get('baiduLicense').then(data => {
      if (data.appid && data.secret) {
        return true
      }
      return false
    })
  }
  activate(appid, secret) {
    const baiduLicense = {appid, secret}
    return syncStorage.set({baiduLicense}).then(() => {
      return this.translate('apple')
    }).then(res => {
      if (res.result == 'ok') {
        return {result: 'ok'}
      }
      return {result: 'error', code: 'InvalidAccount', msg: '激活失败'}
    })
  }
  translate(q, from, to) {
    return syncStorage.get('baiduLicense').then(data => {
      const appid = data.appid
      const secret = data.secret

      const pre = preTranslate(q, from, to)
      q = pre.q.trim()
      from = pre.from
      to = pre.to

      const salt = nonce(8)

      const params = {
        q, from, to, appid, salt,
        sign: md5(appid + q + salt + secret)
      }
      const qs = buildQuery(params)
      return fetch(this.service + this.api.commonTrans + '?' + qs,).then(response => response.json()).then(res => {
        if (!res.error_code) {
          return {result: 'ok', data: res}
        }
        return {result: 'error', code: 'ResponseError', msg: res.error_msg}
      }).catch(err => {
        return {result: 'error', code: 'RequestError', msg: '请求失败'}
      })
    })
  }
}

function preTranslate(q, from, to) {
  if (!q) return {err: 'missing query content'}
  if (q && from && to) return {q, from, to}
  if (!from) from = 'auto'
  if (!to) {
    let toLang = 'zh';
    const testRegex = /[A-Za-z]/g;
    if(!testRegex.test(q)) {
      toLang = 'en';
    }
    to = toLang
  }
  return {q, from, to}
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
var baiduTranslator = new BaiduTranslator()

export {
  proxyTranslator,
  baiduTranslator,
}