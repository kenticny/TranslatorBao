var translate = {
  quickTranslate: function(str, callback) {
    $.get("http://openapi.baidu.com/public/2.0/bmt/translate"
       + "?client_id=z5OMaOk2GlfGj29UFP9siA6Y&q=" + str + "&from=auto&to=auto", 
      function(result) {
        callback(result);
      });
  },
  englishToChinese: function(str, callback) {

  },
  chineseToEnglish: function(str, callback) {

  }
};