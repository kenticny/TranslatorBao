export async function detectMainLanguage(text) {
  const detectResult = await chrome.i18n.detectLanguage(text)
  let [ maxProbability, language ] = [ 0, "" ]
  for (let i = 0; i < detectResult.languages.length; i++) {
    if (detectResult.languages[i].percentage > maxProbability) {
      maxProbability = detectResult.languages[i].percentage
      language = detectResult.languages[i].language
    }
  }
  if (!language) {
    language = 'en'
  }
  return language
}