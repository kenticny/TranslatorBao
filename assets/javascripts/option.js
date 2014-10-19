$(function() {
  $("#currentTag").text("基本设置");
  $("nav .nav_btn").click(function(e) {
    $(".nav_btn").removeClass("active");
    $(e.target).addClass("active");

    $("#currentTag").text($(e.target).text());

    $(".context").removeClass("active");
    $("#" + this.id + "Context").addClass("active");
  });

});