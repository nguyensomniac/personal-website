//= require "jquery"
var workScroll = function() {
  $('html, body').animate({
      scrollTop: $('#work').offset().top
  }, 500);
}
if(window.location.hash === '#work') {
  workScroll();
}