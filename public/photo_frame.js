"use strict";

var random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
var counter = 0;

var imageLoaded = function() {
  var old_image = $("img[data-current]");
  old_image.hide();
  old_image.remove();
  var new_image = $("img[data-loading]");
  new_image.show();
  new_image.attr("data-current", '');
  new_image.removeAttr("data-loading");
}

var createNewImage = function(url) {
  var new_image = $("img[data-template]").clone();
  new_image.each(function(idx, element) {
    $(element).removeAttr("data-template");
    $(element).attr("data-loading", '');
    $(element).hide();
    $("div[data-container]").append(new_image);
    $(element).bind("load", imageLoaded);
    $(element).attr("src", url);
  });
}

var wrapper = function(){
  var image = '/api/image?random=' + random + '&id=' + counter++;
  createNewImage(image);
  setTimeout(wrapper, 10 * 60 * 1000);
};

$(document).ready(wrapper);
