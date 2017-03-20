# responsive-iframes
Makes iframes responsive, I mainly use this for video embeds.

loops through all iframe elements within containerElement

# Usage
```
$(containerElement).responsiveIframes({
    excludeClasses: '.resize-exclude,.instagram-media,.fb_iframe_widget,.twitter-tweet,.flickr-embed-frame', // iframes with these classes will be excluded from resizing
    closestParent: '.content', // the closest parent element to get the target width from.
    verticalCenter: false, // should the video scale to the available height and center itself, instead of scaling to width,
    verticalCenterMin: 500 // min width that vertical center will work with.
});
```
