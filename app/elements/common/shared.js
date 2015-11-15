// Valid price sources
const sources = {'mkm': 'mkm', 'mtgprice': 'mtgprice', 'default':'mtgprice'};

const userDefaults = {
	'collection': 'Inventory', // The default collection
							   // every user is signed up with.
};

// Briefly shakes an element to indicate an incorrect
// action on the part of the user.
function indicateBadness(element) {
	// Turn it on
	element.classList.add('shake');
	element.classList.add('shake-constant');
	element.classList.add('shake-horizontal');

	// Turn it off
	setTimeout(()=>{
		element.classList.remove('shake');
		element.classList.remove('shake-constant');
		element.classList.remove('shake-horizontal');
	}, 200);
}

// Whether or not an element is in view.
//
// With an optional fraction of the element visible.
//
// Courtesy of https://github.com/moagrius/isOnScreen (MIT)
// with some modifications to make jshint happy.
(function ($) {

    $.fn.isOnScreen = function(x, y){

        if(x === null || typeof x === 'undefined') x = 1;
        if(y === null || typeof y === 'undefined') y = 1;

        var win = $(window);

        var viewport = {
            top : win.scrollTop(),
            left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var height = this.outerHeight();
        var width = this.outerWidth();

        if(!width || !height){
            return false;
        }

        var bounds = this.offset();
        bounds.right = bounds.left + width;
        bounds.bottom = bounds.top + height;

        var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        if(!visible){
            return false;
        }

        var deltas = {
            top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
            bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),
            left : Math.min(1, ( bounds.right - viewport.left ) / width),
            right : Math.min(1, ( viewport.right - bounds.left ) / width)
        };

        return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;

    };

})(jQuery);