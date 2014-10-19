var translateEngine = function(engine, text) {
  var url = {
    "youdao": "http://fanyi.youdao.com/openapi.do?keyfrom=Translatebao&key=1061309406&type=data&doctype=json&version=1.1&q=" + text,
    "baidu": "http://openapi.baidu.com/public/2.0/bmt/translate?client_id=z5OMaOk2GlfGj29UFP9siA6Y&from=auto&to=auto&q=" + text
  };
  return url[engine];
}
var translate = {
  quickTranslate: function(str, callback) {
    $.get(translateEngine("baidu", str), function(result) {
      callback(result);
    });
  },
  englishToChinese: function(str, callback) {

  },
  chineseToEnglish: function(str, callback) {

  }
};

