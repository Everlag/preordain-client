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

// Whether or not an element is in view
//
// Finicky but works, courtesy of:
//  http://stackoverflow.com/a/22480938
function inView(element) {
	let elementTop    = element.getBoundingClientRect().top;
	let elementBottom = element.getBoundingClientRect().bottom;

	return elementTop >= 0 && elementBottom <= window.innerHeight;
}