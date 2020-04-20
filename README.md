
---
## Structure

    |-- [_build]
    |   |-- output
    |
    |-- [_zip]
    |   |-- output zip of build
    |
    |-- [grunt]
    |   |-- grunt code
    |
    |-- [src]
    |   |
    |   |-- [_common]
    |   |   |
    |   |   |--links.html (creates index.html list of banners)
    |   |   |--banner_template.html (for all banners)
    |   |   |--static_template.html (gif/image only banners)
    |   |   |
    |   |   |-- [_global]
    |   |   |   |
    |   |   |   |-- files mixed in across all banners
    |   |   |   |-- clicktag.js (*required)
    |   |   |
    |   |   |-- [banner_size(s)]
    |   |       |
    |   |       |-- files mixed in across all size variant
    |   |
    |   |-- [banner_creative_group(s)]
    |       |
    |       |-- clicktag.js (*optional)
    |       |-- names.json (*optional)
    |       |
    |       |-- [banner_size(s)]
    |           |
    |           |-- files used only for this banner variant
    |           |-- clicktag.js (*optional)



---
## If you haven't used Node or Grunt before

* download and install: nodejs.org
* in terminal install grunt-cli: sudo npm install -g grunt-cli

* Node's [Getting Started](https://docs.npmjs.com/getting-started/installing-node) guide.
* Grunt's [Getting Started](http://gruntjs.com/getting-started) guide.



---
## If you haven't used git before

* try [Sourcetree](https://confluence.atlassian.com/get-started-with-sourcetree/)

be sure you have the '.gitignore' file before commiting to git.   
its a hidden file so you might need to show hidden files on you system.  
it stops unwanted files being uploaded to the git repo.  

commit: root files (package.json etc), grunt and src folders.  
DO NOT commit: node_modules, _build, _zip, _tmp, these are always created locally.  

as a rule of thumb do not upload creative working files such as photoshop PSD



---
## Getting started

* download/clone this project
* open terminal at that directory
* run 'npm install'
* run 'grunt'


---
## Grunt commands (Main)  

* grunt           - runs build, starts localhost server, watches code and auto build on file changes
* grunt build     - compile src banners to _build
* grunt zip       - zip existing _build folder
* grunt min       - minify js/css in existing _build folder

## Grunt commands (Extra tools)  

* grunt imagejs - creates image.js if doesnt already exist, json var of images in each src folder
* grunt pngmin:tmp - pngquant compress all pngs in tmp/pngmin folder
* grunt pngmin:build - pngquant compress all pngs in the build folder
* grunt stills - captures build banner end frame as png and compresses to jpeg
* grunt videos - screen records build banner to mp4


---
## names and overrides

for content src overrides common(WxH) which in turn overrides global    
e.g. src bg.jpg overrides common bg.jpg which in turn overrides global bg.jpg   

for code src, common and global are by default concatenated,    
e.g. src/anim.js + common/anim.js + global/anim.js are concatenated to output as main.js   

be aware if code across files needs running in strict order files are concatenated alpha-numerically,   
e.g. bar.js is concatenated before foo.js  

the following files if placed in src or common folders will override default process.    

override.html       - overrides global banner_template.html it can use banner template variables if required    
override.{css,less} - will be only file. does not concatenate with any other css/less. .less take precedence over .css   
override.js         - will be only file. does not concatenate with any other js    



---
## clicktag.js

javascript clicktag variable that gets written to the banner HTML.  
clicktag.js in a src folder takes precedence over clicktag.js in a src group folder which takes precedence over global.  
clicktag.js in _global must exist.  

example:  
var clickTag = "your_url_here";



---
## names.json

by default banners are named from their folder names: creative_folder + _ + size_folder  
e.g. MASTER_BUILD_300x250

optionally you can override the default naming convention for banners per creative_folder.  
this is useful if you have a naming convention where the size is in the middle of the name string.  

example for all (the #size# param gets compiled as size_folder_name):

{  
    "all":"MASTER_BUILD_#size#_STANDARD_HTML"  
}  

example for all with an exception:

{  
    "all":"MASTER_BUILD_#size#_STANDARD_HTML",  
    "320x50":"MASTER_BUILD_300x50_STANDARD_JPG"  
}  

example individual list (optionally use #size# param also):

{  
    "160x600":"MASTER_BUILD_160x600_STANDARD_HTML",  
    "300x250":"STUDENT_BUILD_300x250_STANDARD_HTML",  
    "300x600":"JEDI_BUILD_300x250_STANDARD_HTML",  
    "970x250":"SITH_BUILD_#size#_STANDARD_HTML",  
    "320x50":"EWOK_BUILD_#size#_STANDARD_JPG"  
};  



---
## Animated gifs / static image only banners

Add only 1 image file into a size folder.  

e.g. 300x50/banner.{gif,jpeg}  

any more than 1 file and the folder will be treated as if a standard banner



---
## sample files   

'standard' banners are to IAB spec   
- politeloader loads images after window.onload  
- basic $ queryselector for selecting elements  
- tweenmax for animation  


'doubleclick' banners are same as 'standard' with the following changes   
- enabler added to template html  
- onload.js has enabler start sequence  
- clicktag.js commented out  
- banner.js init no longer calls startAnimation, click uses enabler.exit   


---
## testing and browser support for banners  

no point going further than ad platform support, heres doubleclick 2017:   
https://support.google.com/richmedia/answer/138582?hl=en-GB    
Win 7: Chrome 44, Edge, IE 11, Firefox 41   
MacOS 10.5: Chrome 44, Firefox 41, Safari 5   
iOS 8: Safari 7   
Android 4.4: Chrome  

January 2016 Microsoft ended support for Win 8, IE 10 (and anything older).   
https://www.microsoft.com/en-gb/windowsforbusiness/end-of-ie-support   

If you can, support the end of support by displaying a failover/ unsupported/ upgrade message.   

For video just use mp4 (h.264), support by volume from approx. 2011, firefox and opera support 2015:   
desktop: IE9, safari5, firefox35, opera25, chrome, edge  
mobile: Safari7, Android4.4, Chrome42, Opera12, IE10   

If you want to search whats currently in wide use:  
https://caniuse.com/usage-table   
