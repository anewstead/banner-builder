var banner = {};
banner.init = function() {
  banner.addListeners();
  banner.initAnimation();
  //hide preloader, show banner
  $('.loading_state').style.display = 'none';
  $('.main_content').style.visibility = 'visible';
  //start animation after tiny delay
  console.log('start frame');
  setTimeout(banner.startAnimation, 333);
};

banner.addListeners = function() {
  $('.default_exit').addEventListener('click', banner.click, false);
  $('.default_exit').addEventListener('mouseover', banner.mouseover, false);
  $('.default_exit').addEventListener('mouseout', banner.mouseout, false);
};

//clickTag variable set in HMTL
banner.click = function(event) {
  console.log('clickTag: ' + clickTag);
  window.open(clickTag, '_blank');
};

banner.mouseover = function(event) {
  $('.cta').style.visibility = 'hidden';
  $('.cta_over').style.visibility = 'visible';
  TweenMax.to('.cta_button', 0.2, {
    scale: 1.1
  });
};

banner.mouseout = function(event) {
  $('.cta').style.visibility = 'visible';
  $('.cta_over').style.visibility = 'hidden';
  TweenMax.to('.cta_button', 0.2, {
    scale: 1
  });
};

banner.startAnimation = function() {
  banner.startTime = new Date();
  banner.showf1();
};

//call this at the end of your animation
banner.endAnimation = function() {
  //be certain everything finished as expected
  TweenMax.killAll();
  //log duration
  var duration = ((new Date() - banner.startTime) / 1000);
  console.log('end frame: ' + duration + ' seconds');
};
