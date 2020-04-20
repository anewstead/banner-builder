//it all starts here
window.addEventListener('load', function() {
  if (Enabler.isInitialized()) {
    dc.enablerReady();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, dc.enablerReady);
  }
});

//doubleclick
var dc = {};

//enabler ready, load polite images
dc.enablerReady = function() {
  politeLoader.loadImages(banner.politeImages, dc.imagesLoaded);
};

//images loaded, init banner and show when visible
dc.imagesLoaded = function() {
  banner.init();
  if (Enabler.isVisible()) {
    banner.startAnimation();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, banner.startAnimation);
  }
};
