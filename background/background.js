import { localStorage } from "../libs/storage.js";

chrome.runtime.onInstalled.addListener(async () => {
  await localStorage.set("test", "haha")
  await localStorage.set("test2", "bbb")
  await localStorage.set("test3", {"ccc": 111})
  const v = await localStorage.get("test3")
  console.log(v)
})
