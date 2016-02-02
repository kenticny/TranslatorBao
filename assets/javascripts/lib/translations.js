
var translateEngine = function(engine, text, callback) {
  if(engine !== 'baidu') return 'not support';
  var API = 'http://api.fanyi.baidu.com/api/trans/vip/translate';

  chrome.storage.sync.get('licence', function(data) {
    var licence = data.licence;
    if(!licence) {
      chrome.storage.sync.clear($.noop);
      return callback({error_msg: '无法验证的Licence'});
    }

    var toLang = 'zh';
    var appId = licence.a;
    var secret = licence.s;
    var encryptKey = '' || 'TranslateBaoExtensionsForChrome';

    function getSignture(appid, query, salt, secret) {
      return md5(appid + query + salt + secret)
    }

    var params = {
      q: text,
      from: 'auto',
      to: toLang,
      appid: appId,
      salt: encryptKey,
      sign: getSignture(appId, text, encryptKey, secret)
    };

    return callback(null, API + '?' + $.param(params));
  });
}

var translate = {
  quickTranslate: function(str, callback) {
    translateEngine("baidu", str, function(err, path) {
      console.log(err, path)
      if(err) return callback(err);
      $.get(path, function(result) { callback(result); });
    });
  },
  // englishToChinese: function(str, callback) {
  //   $.get(translateEngine("baidu", str, {from: "en", to: "zh"}), function(result) {
  //     callback(result);
  //   });
  // },
  // chineseToEnglish: function(str, callback) {
  //   $.get(translateEngine("baidu", str, {from: "zh", to: "en"}), function(result) {
  //     callback(result);
  //   });
  // }
};