/*
set start state before animation begins
*/
banner.initAnimation = function() {
  TweenMax.set(['.cta_button', '.f2_txt_end'], {
    opacity: 0
  });
  TweenMax.set('.copy', {
    opacity: 0,
    y: 30
  });
};

/*
START FRAME
*/
banner.showf1 = function() {
  var tl = new TimelineMax({onComplete: banner.showf1complete});
  tl.add(TweenMax.staggerTo($('.frame_1 .copy'), 1, {
    y: 0,
    opacity: 1,
    ease: Expo.easeOut
  }, 0.2));
};

banner.showf1complete = function() {
  console.log('frame1');
  TweenMax.delayedCall(2, banner.hidef1);
};

banner.hidef1 = function() {
  var tl = new TimelineMax({onComplete: banner.hidef1complete});
  tl.add(TweenMax.staggerTo($('.frame_1 .copy'), 0.5, {
    y: -50,
    opacity: 0,
    ease: Expo.easeOut
  }, 0.2));
};

banner.hidef1complete = function() {
  banner.showEnd();
};

/*
END FRAME
*/
banner.showEnd = function() {
  var tl = new TimelineMax({onComplete: banner.showEndcomplete});
  tl.add(TweenMax.staggerTo($('.frame_2 .copy'), 1, {
    y: 0,
    opacity: 1,
    ease: Expo.easeOut
  }, 0.2));
  tl.add(TweenMax.to(['.f2_txt_end', '.cta_button'], 0.5, {
    autoAlpha: 1
  }), '-=0.5');
};

banner.showEndcomplete = function() {
  banner.endAnimation();
};
