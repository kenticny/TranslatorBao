$(function() {
  $("#current-tag").text("基本设置");
  $("nav .nav_btn").click(function(e) {
    $(".nav_btn").removeClass("active");
    $(e.target).addClass("active");

    $("#current-tag").text($(e.target).text());

    $(".context").removeClass("active");
    $("#" + this.id + "-context").addClass("active");
  });

  // 验证licence
  $("#validate-licence").click(function() {
    var licence = $(".licence").val();
    var se = null;

    try { se = atob(licence); }
    catch(e) { message('验证失败'); return; }

    var separator = se[se.length - 1];
    var dataArr = se.split(separator).filter(function(n) {return n});
    chrome.storage.sync.set({licence: {a: dataArr[0], s: dataArr[1]}}, function() {
        message('验证成功');
    });
  });

  function message(text) {
    $('.tip-message').text(text);
    setTimeout(function() {
        $('.tip-message').text('');
    }, 2000);
  }
});