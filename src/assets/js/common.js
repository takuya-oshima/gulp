$(function(){
  //IE11判定
  const ua = navigator.userAgent;
  if(ua.indexOf('Trident') !== -1) {
    $('body').addClass('ie');
    $('.page-wrap').prepend('<div class="alert-ie"><div class="alert-ie-inner"><p class="alert-ie-text">お使いのブラウザは推奨されていません。</p></div></div>');
  }

  //SPメニュー開
  $('#js-sp-menu').click(function () {
    $(this).toggleClass('open');
    $('.header-global-navi').fadeToggle(300);
    $('html,body').toggleClass('fiexd');
  });

  //TOPスライド
  $('#js-top-mainvisual').slick({
    fade: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    dotsClass: 'slide-dots',
    arrows: false
  });

});
