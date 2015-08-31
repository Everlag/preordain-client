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