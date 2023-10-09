import { md5 } from '../libs/md5/md5.js'
import { detectMainLanguage } from '../libs/language_detect/language_detect.js'
import { settings } from '../libs/settings/settings.js'

class BaiduTranslator {
  constructor() {
    this.service = 'https://fanyi-api.baidu.com'
    this.api = {
      commonTrans: '/api/trans/vip/translate'
    }
  }
  async existsLicense() {
    const license = await settings.getEngineBaidu()
    if (!license) {
      return false
    }
    if (license.appid && license.secret) {
      return true
    }
    return false
  }
  async activate(appid, secret) {
    await settings.setEngineBaidu(appid, secret)
    const transRes = await this.translate('apple')
    if (transRes.result == 'ok') {
      return {result: 'ok'}
    }
    return {result: 'error', code: 'InvalidAccount', msg: '激活失败'}
  }
  async deactivate() {
    return await settings.delEngineBaidu()
  }
  async translate(query, fromLanguage, toLanguage) {
    try {
      const license = await settings.getEngineBaidu()
      if (!license.appid || !license.secret) {
        return {result: 'error', code: 'InvalidAccount', msg: '未激活'}
      }
      const { q, from, to } = await preTranslate(query, fromLanguage, toLanguage)
      const salt = nonce(8)
      const params = {
        q, from, to, appid: license.appid, salt,
        sign: md5(license.appid + q + salt + license.secret)
      }
      const qs = buildQuery(params)
      const api = this.service + this.api.commonTrans + '?' + qs
      const resp = await fetch(api)
      const respData = await resp.json()
      if (!respData.error_code) {
        return {result: 'ok', data: respData}
      }
      return {result: 'error', code: 'ResponseError', msg: respData.error_msg}
    } catch (e) {
      return {result: 'error', code: 'NetworkError', msg: e.message}
    }
  }
}

async function preTranslate(q, from, to) {
  if (!q) return {err: 'missing query content'}
  if (q && from && to) return {q, from, to}
  if (!from) from = 'auto'
  if (!to) {
    const sourceLanguage = await detectMainLanguage(q)
    if (sourceLanguage == 'zh') {
      to = 'en'
    } else {
      to = 'zh'
    }
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

export const baiduTranslator = new BaiduTranslator()
