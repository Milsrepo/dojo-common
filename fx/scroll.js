/* =============================================================

 Smooth Scroll 2.5

 Fork for DOJO

 Animate scrolling to anchor links, by Chris Ferdinandi.
 http://gomakethings.com

 Easing support contributed by Willem Liu.
 https://github.com/willemliu

 Easing functions forked from Gaëtan Renaudeau.
 https://gist.github.com/gre/1650294

 Free to use under the MIT License.
 http://gomakethings.com/mit/

 Cloned from :
    https://github.com/cferdinandi/smooth-scroll.git

 * ============================================================= */

define(["dojo/_base/lang", "dojo/Deferred",
        "dojo/dom-geometry","dojo/_base/sniff"],
       function(lang, Deferred, domGeom, has) {
return function (node, duration, easing, win) {

        var startLocation = domGeom.docScroll().y;
        var endLocation = domGeom.position(node, true).y;
        var deferred = new Deferred();

        win = win || window;

        var isWindow = lang[(has("ie") ? "isObject" : "isFunction")](win.scrollTo);

        var distance = endLocation - startLocation;
        var increments = distance / (duration / 16);
        var timeLapsed = 0;
        var percentage, position, stopAnimation;

        // Functions to control easing
        var easingPattern = function (type, timing) {
            if ( type == 'linear' ) return timing; // no easing, no acceleration
            if ( type == 'easeInGentle' ) return timing * timing; // accelerating from zero velocity
            if ( type == 'easeOutGentle' ) return timing * (2 - timing); // decelerating to zero velocity
            if ( type == 'easeInOutGentle' ) return timing < 0.5 ? 2 * timing * timing : -1 + (4 - 2 * timing) * timing; // acceleration until halfway, then deceleration
            if ( type == 'easeInNormal' ) return timing * timing * timing; // accelerating from zero velocity
            if ( type == 'easeOutNormal' ) return (--timing) * timing * timing + 1; // decelerating to zero velocity
            if ( type == 'easeInOutNormal' ) return timing < 0.5 ? 4 * timing * timing * timing : (timing - 1) * (2 * timing - 2) * (2 * timing - 2) + 1; // acceleration until halfway, then deceleration
            if ( type == 'easeInIntense' ) return timing * timing * timing * timing; // accelerating from zero velocity
            if ( type == 'easeOutInense' ) return 1 - (--timing) * timing * timing * timing; // decelerating to zero velocity
            if ( type == 'easeInOutIntense' ) return timing < 0.5 ? 8 * timing * timing * timing * timing : 1 - 8 * (--timing) * timing * timing * timing; // acceleration until halfway, then deceleration
            if ( type == 'easeInExtreme' ) return timing * timing * timing * timing * timing; // accelerating from zero velocity
            if ( type == 'easeOutExtreme' ) return 1 + (--timing) * timing * timing * timing * timing; // decelerating to zero velocity
            if ( type == 'easeInOutExtreme' ) return timing < 0.5 ? 16 * timing * timing * timing * timing * timing : 1 + 16 * (--timing) * timing * timing * timing * timing; // acceleration until halfway, then deceleration
        };

        // Scroll the page by an increment, and check if it's time to stop
        var animateScroll = function () {
            timeLapsed += 16;
            percentage = ( timeLapsed / duration );
            percentage = ( percentage > 1 ) ? 1 : percentage;
            position = startLocation + ( distance * easingPattern(easing, percentage) );
            if (isWindow) {
                win.scrollTo(0, position)
            } else {
                win.scrollLeft = 0;
                win.scrollTop = position;
            }
            stopAnimation();
        };

        // Stop the animation
        if ( increments >= 0 ) { // If scrolling down
            // Stop animation when you reach the node OR the bottom of the page
            stopAnimation = function () {
                var travelled = isWindow ? domGeom.docScroll().y : domGeom.position(win).y;
                if ( (travelled >= (endLocation - increments))) {
                    clearInterval(runAnimation);
                    deferred.resolve();
                }
            };
        } else { // If scrolling up
            // Stop animation when you reach the node OR the top of the page
            stopAnimation = function () {
                var travelled = isWindow ? domGeom.docScroll().y : domGeom.position(win).y;
                if ( travelled <= (endLocation || 0) ) {
                    clearInterval(runAnimation);
                    deferred.resolve();
                }
            };
        }

        // Loop the animation function
        var runAnimation = setInterval(animateScroll, 16);
        return deferred;
    };
});
