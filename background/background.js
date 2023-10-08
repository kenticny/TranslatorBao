import { localStorage as storage } from "../libs/storage/storage.js";
import { md5 } from "../libs/md5/md5.js";
import { detectMainLanguage } from "../libs/language_detect/language_detect.js";
import { baiduTranslator } from "../translators/baidu.js";


chrome.runtime.onInstalled.addListener(async () => {

})

chrome.management.get(chrome.runtime.id, async (extensionInfo) => {
  // UNIT TEST
  if (extensionInfo.installType === 'development') {
    console.log("================== storage test ======================")
    await storage.set("test", "haha")
    await storage.set("test2", 123)
    await storage.set("test3", { "ccc": 111 })
    await storage.set("test4", ["aaa", "bbb", "ccc"])
    const v1 = await storage.get("test")
    const v2 = await storage.get("test2")
    const v3 = await storage.get("test3")
    const v4 = await storage.get("test4")
    console.log("case 1: storage set / get string value: ", v1 == "haha" ? "pass" : "fail")
    console.log("case 2: storage set / get number value: ", v2 == 123 ? "pass" : "fail")
    console.log("case 3: storage set / get object value: ", v3.ccc == 111 ? "pass" : "fail")
    console.log("case 4: storage set / get array value: ", v4[2] == "ccc" ? "pass" : "fail")

    await storage.del("test")
    console.log("case 5: storage del value: ", await storage.get("test") == undefined ? "pass" : "fail")
    console.log("case 6: storage get other value: ", await storage.get("test2") == 123 ? "pass" : "fail")

    console.log("\n")

    console.log("=================== md5 test ======================")
    const md5_1 = md5("abc")
    const md5_2 = md5("123")
    const md5_3 = md5("abc123")
    console.log("case 1: md5('abc') = ", md5_1 == "900150983cd24fb0d6963f7d28e17f72" ? "pass" : "fail")
    console.log("case 2: md5('123') = ", md5_2 == "202cb962ac59075b964b07152d234b70" ? "pass" : "fail")
    console.log("case 3: md5('abc123') = ", md5_3 == "e99a18c428cb38d5f260853678922e03" ? "pass" : "fail")
    console.log("\n")

    console.log("=================== language detect test ======================")
    const lang1 = await detectMainLanguage("what the fuck")
    const lang2 = await detectMainLanguage("你好世界")
    const lang3 = await detectMainLanguage("こんにちは世界")
    const lang4 = await detectMainLanguage("안녕하세요 세계")
    const lang5 = await detectMainLanguage("你好世界 hello world")
    console.log("case 1: detectMainLanguage('what the fuck') = ", lang1 == "en" ? "pass" : "fail")
    console.log("case 2: detectMainLanguage('你好世界') = ", lang2 == "zh" ? "pass" : "fail")
    console.log("case 3: detectMainLanguage('こんにちは世界') = ", lang3 == "ja" ? "pass" : "fail")
    console.log("case 4: detectMainLanguage('안녕하세요 세계') = ", lang4 == "ko" ? "pass" : "fail")
    console.log("case 5: detectMainLanguage('你好世界 hello world') = ", lang5 == "zh" ? "pass" : "fail")
    console.log("\n")
    
    console.log("=================== baidu translator test ======================")
    const isExistLicense = await baiduTranslator.existsLicense()
    if (!isExistLicense) {
      const activateResult = await baiduTranslator.activate("20151218000007985","cbL3SFQIP0xQZtXmnufY")
      if (activateResult.result != 'ok') {
        await storage.del("baiduLicense")
        throw new Error(activateResult.code + ": " + activateResult.msg)
      }
    }

    const res = await baiduTranslator.translate("hi")
    console.log("case 1: translate English to Chinese: ", res.data.trans_result[0].dst == '你好' ? "pass" : "fail")

    const res2 = await baiduTranslator.translate("苹果")
    console.log("case 2: translate Chinese to English: ", res2.data.trans_result[0].dst == 'apple' ? "pass" : "fail")

  }
});