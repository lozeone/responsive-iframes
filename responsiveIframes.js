/**
 * responsiveIframes jQuery Plugin
 * makes iframes responsive. primarily used for video embeds.
 * 3/18/17
 * by lozeone
 */

(function($) {

  $.responsiveIframes = function(element, options) {

    // plugin's default options
    // this is private property and is  accessible only from inside the plugin
    var defaults = {
      excludeClasses: '.resize-exclude,.instagram-media,.fb_iframe_widget,.twitter-tweet,.flickr-embed-frame', // iframes with these classes will be excluded from resizing
      closestParent: '.content', // the parent element that will be used to determine the max width.
      verticalCenter: false, // should the video scale to the available height and center itself, instead of scaling to width,
      verticalCenterMin: 500
      //excludeGoogleAds: true, // exclude DFP ad units

    }

    // to avoid confusions, use "plugin" to reference the current instance of the object
    var plugin = this;

    plugin.settings = {}

    var $element = $(element), // reference to the jQuery version of DOM element the plugin is attached to
      element = element; // reference to the actual DOM element

    //var cnt = 0;

    // ====================================================================
    // the "constructor" method that gets called when the object is created
    plugin.init = function() {

      // the plugin's final properties are the merged default and user-provided options (if any)
      plugin.settings = $.extend({}, defaults, options);

      var selector = 'iframe:not([id^=google_ads_iframe_]):not(.responsiveIframe,' + plugin.settings.excludeClasses + ')';
      var $frames = $element.find(selector);



      // if we have no frames, bail.
      if(!$frames.length){
        return;
      }

      //console.log('init', $frames);


      //set original Sizes.
      $frames.each(function(k, el) {
        $el = $(el);
        $(el).data({
          'aspectRatioH': $el.width() / $el.height(),
          'aspectRatioW': $el.height() / $el.width(),
          'origHeight': $el.height(),
          'origWidth': $el.width()
        }).removeAttr('height').removeAttr('width').addClass('responsiveIframe');
      });

      // trigger the first resize.
      resizeIframes($frames);

      // set up resizing on window event.
      $(window).on('resize', function(){
        resizeIframes($frames);
      });

    }

    // ==============================================================
    // private methods
    // these methods can be called only from inside the plugin like:
    // methodName(arg1, arg2, ... argn)

    // a private method. for demonstration purposes only - remove it!
    /*var foo_private_method = function() {

      // code goes here

    }*/

    var resizeIframes = function(frames) {
      //console.log('resize frames...', cnt++);
      //resize the iframes
      frames.each(function(k, el) {
        $el = $(el);
        var src = $el.attr('src');
        var $parent = $el.closest(plugin.settings.closestParent);
        // skip frames with a facebook source. @@todo: this should be a config setting.
        if (!src.match("^https?://www.facebook.com")) {
          if (!plugin.settings.verticalCenter) {
            // scale to max width.
            var newWidth = $parent.width();
            if (newWidth < $el.data('origWidth')) {
              $el
                .width(newWidth)
                .height(newWidth * $el.data('aspectRatioW'));
            } else {
              $el
                .width($el.data('origWidth'))
                .height($el.data('origHeight'));
            }
          } else {
            // scale to max height.
            if ($parent.width() > plugin.settings.verticalCenterMin) {

              var newHeight = $parent.height();
              if (newHeight != $el.height()) { //$el.data('origHeight')
                $el
                  .height(newHeight)
                  .width(newHeight * $el.data('aspectRatioH'));
              }

              var newWidth = $parent.width() - 90;
              if (newWidth < $el.width()) {
                $el
                  .width(newWidth)
                  .height(newWidth * $el.data('aspectRatioW'));
              }

              // center height
              if ($el.height() < $parent.height()) {
                $el.css('marginTop', ($parent.height() - $el.height()) / 2);
              } else {
                $el.css('marginTop', 0);
              }
            } else {
              // < 500 wide
              var newWidth = $parent.width();
              $el.css('marginTop', 0);
              if (newWidth != $el.width()) {
                $el
                  .width(newWidth)
                  .height(newWidth * $el.data('aspectRatioW'));
              }
            }
          }
        }
      });
    }

    // call the "constructor" method
    plugin.init();

  }


  // add the plugin to the jQuery.fn object
  $.fn.responsiveIframes = function(options) {

    // iterate through the DOM elements we are attaching the plugin to
    return this.each(function() {
        var plugin = new $.responsiveIframes(this, options);
    });

  }

})(jQuery);
