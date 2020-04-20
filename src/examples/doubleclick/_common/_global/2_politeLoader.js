/*
loads an array of image into existing divs where class is filename without .ext
objArray = [{url:'img.jpg',retina:true},{...}];
callback function on complete
*/
var politeLoader = {};
politeLoader.loadImages = function(objArray, callback) {
  if (!objArray || !callback || objArray.length < 1) {
    console.error('politeLoader: incorrect parameters');
  }
  //check progress for all loaded
  var loaded = 0;
  var checkProgress = function() {
    if (++loaded === objArray.length) {
      callback();
    }
  };
  //catch errors
  var imgError = function() {
    console.log('politeLoader: File not found: ' + this.src);
    checkProgress();
  };
  //file loaded
  var imgLoaded = function() {
    if (String(this.getAttribute('retina')) === 'true') {
      this.removeAttribute('retina');
      this.width *= 0.5;
      this.height *= 0.5;
    }else {
      //ensures attribute is written to html
      this.width = this.width;
      this.height = this.height;
    }
    //class is filename from url without .ext
    var cls = '.' + this.src.split('/').pop().split('.')[0];
    //handle class used single or multiple times
    var container = $(cls);
    if (container) {
      if (container.length) {
        appendImg(this, container[0]);
        for (var j = 1; j < container.length; j++) {
          appendImg(this.cloneNode(), container[j]);
        }
      } else {
        appendImg(this, container);
      }
    } else {
      console.log('politeLoader: container with class "' + cls + '" not found');
    }
    checkProgress();
  };
  //add image and set container dimensions
  var appendImg = function(img, el) {
    el.appendChild(img);
    // el.style.width = img.width + 'px';
    // el.style.height = img.height + 'px';
  };
  //load images
  for (var i = 0; i < objArray.length; i++) {
    var img = document.createElement('img');
    img.onload = imgLoaded;
    img.onerror = imgError;
    var obj = objArray[i];
    if (obj.retina && obj.retina !== '') {
      img.setAttribute('retina', obj.retina);
      // img.setAttribute('class', 'retina');
    }
    img.setAttribute('src', obj.url);
  }
};
