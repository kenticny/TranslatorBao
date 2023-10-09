import { localStorage as storage } from "../storage/storage.js";

class Settings {
  constructor(props) {
    this._prefix = props?.prefix || 'settings'
  }

  async setEngineBaidu(appid, secret) {
    const settings = (await storage.get(this._prefix) ?? {})
    settings.engine = settings.engine ?? {}
    settings.engine.baidu = {appid, secret}
    await storage.set(this._prefix, settings)
  }

  async getEngineBaidu() {
    const settings = await storage.get(this._prefix)
    return settings?.engine?.baidu
  }

  async delEngineBaidu() {
    const settings = (await storage.get(this._prefix) ?? {})
    delete settings.engine?.baidu
    await storage.set(this._prefix, settings)
  }

  async getAvailableEngines() {
    const settings = await storage.get(this._prefix)
    return settings?.engine ?? {}
  }

  async setProxyEngine(key, secret, term, description, name) {
    throw new Error("unsuppport")
  }

  async setActiveEngine(engine) {
    const settings = (await storage.get(this._prefix) ?? {})
    if (!(engine in settings.engine)) throw new Error("invalid engine: " + engine)
    settings.activeEngine = engine
    await storage.set(this._prefix, settings)
  }

  async getActiveEngine() {
    const settings = await storage.get(this._prefix)
    const activeEngineName = settings?.activeEngine
    return settings?.engine?.[activeEngineName]
  }

  async reset() {
    await storage.del(this._prefix)
  }
}

export const settings = new Settings({ prefix: 'settings' })
export const settingsTest = new Settings({ prefix: 'settings_test' })