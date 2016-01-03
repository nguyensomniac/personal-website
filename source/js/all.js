//= require "jquery"
//= require "jquery.typer"

(function($)  {
  //On scroll, change navbar to fixed to absolute
  var fixNav = function() {
    var $navbar = $('.header');
    var fixStart = $('.vertical-offset').offset().top;
    var pos = $(window).scrollTop();
    if ($navbar.hasClass('header__absolute') && pos >= fixStart)  {
      $navbar.removeClass('header__absolute').addClass('header__fixed');
    }
    else if ($navbar.hasClass('header__fixed') && pos < fixStart) {
      $navbar.removeClass('header__fixed').addClass('header__absolute');
    }
  }
  //change active link on scroll
  var changeActive = function() {
    var offsets;
    var $navigation = $('.header--navigation .header--link');
    var $navbar = $('.header');
    try {      
      offsets = {
        work: $('#projects').offset().top,
        about: $('#about').offset().top - $navbar.outerHeight(),
        contact: $('#contact').offset().top - $navbar.outerHeight()
      }
    }
    catch(err)  {
      return;
    }
    var pos = $(window).scrollTop();
    if (pos >= offsets.work && pos < offsets.about) {
      $navigation.filter('[href*="#projects"]').addClass('active');
      $navigation.filter(':not([href*="#projects"])').removeClass('active');
    }
    else if (pos >= offsets.about && pos < offsets.contact) {
      $navigation.filter('[href*="#about"]').addClass('active');
      $navigation.filter(':not([href*="#about"])').removeClass('active');
    }
    else if (pos >= offsets.contact) {
      $navigation.filter('[href*="#contact"]').addClass('active');
      $navigation.filter(':not([href*="#contact"])').removeClass('active');
    }
    else  {
      $navigation.removeClass('active');
    }
  }
  //Change titles
  var titleNum = 0;
  var buttonNum = 0;
  $.typer.options.typeSpeed = 50;
  var changeTitle = function() {
    var titles = ['a Bay Area based designer and developer.',
      'a maker at UC Berkeley.',
      "and I'm a pen tool addict.",
      'a lorem ipsum dolor sit amet.',
      "and I'm probably pulling an all-nighter.",
      "and I always feel like a plastic bag."];
    var sarcasticButtons = [ 'and what else?',
      'cool story bro',
      'no1curr',
      '+$19.99 shipping & handling',
      'nope.',
      'try again'
    ];
    var $typed = $('.typed');
    var $button = $('.switcher');
    var t = Math.floor(Math.random() * titles.length);
    var b = Math.floor(Math.random() * sarcasticButtons.length);
    if (t != titleNum && b != buttonNum)  {
      titleNum = t;
      buttonNum = b;
      $typed.typeTo(titles[t]);
      $button.text(sarcasticButtons[b]);
    }
    else  {
      changeTitle();
    }
  }
  $(document).on('click', '.header--link', function(e) {
    var $navbar = $('.header');
    var offsets = {
      projects: 1,
      about: -.5 * $navbar.outerHeight(),
      contact: -.5 * $navbar.outerHeight()
    }
    var hash = $(this).attr('href').split('#')[1];
    if ($('#' + hash).length != 0)  {
      e.preventDefault();
      $(document.body).animate({
        scrollTop: $('#' + hash).offset().top + offsets[hash]
      }, 500);
      history.pushState(null, null, '#' + hash);
    }
  })
  $(window).scroll(function() {
    fixNav();
    changeActive();
  });
  $(document).on('click', '.switcher', function() {
    changeTitle();
  })
})(jQuery);
