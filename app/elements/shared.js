// Store all remote urls so we don't overly pollute global scope
const remote = {
	cardText: 'https://beta.perfectlag.me/cardText/',
	cardSymbol: 'https://beta.perfectlag.me/cardSymbols/',
	cardImage: 'https://beta.perfectlag.me/cardImages/',
	cardPrice: 'https://beta.perfectlag.me/api/Prices/Card',
	setPrice: 'https://beta.perfectlag.me/api/Prices/Set',
	typeAhead: 'https://beta.perfectlag.me/typeAhead/%QUERY.json',
	users: 'https://beta.perfectlag.me/api/Users',
};

// Store all the suffixes here.
const suffixes = {
	LatestHighestSuffix: 'LatestHighest',
	LatestLowestSuffix: 'LatestLowest',
	LatestSpecificSuffix: 'Latest',
	WeeksMedianSuffix: 'WeeksMedian',
	ClosestSuffix: 'Closest',
	ExpectedValue: 'EV',
};

// Valid price sources
const sources = {'mkm': 'mkm', 'mtgprice': 'mtgprice', 'default':'mtgprice'};

// Card price URL builders
function buildCardURL(cardName) {
	return `${remote.cardText}${cardName}.json`;
}

function buildSymbolURL (symbolName) {
	let cleaned = symbolName.toLocaleLowerCase().replace('/', '');
	return `${remote.cardSymbol}${cleaned}.svg`;
}

function buildSetSymbolURL (setName){
	let cleaned = setName
	.replace('/', '')
	.replace('Foil', '')
	.trim();
	
	return `${remote.cardSymbol}${cleaned}.svg`;
}

function buildImageURL (imageName) {
	return `${remote.cardImage}${imageName}.jpg`;
}

// For the most part an image name is simply the same as the card
// name but without any capital letters.
//
// This makes some minor effort to correct for edge cases such as split
// cards but makes no guarantees. Always use the imagename presented by the
// server in mtg-card-data when available.
function cardToImageName(cardName){
	cardName = cardName.split('//')[0];

	return cardName
	.replace(':', '')
	.replace('AE', 'Æ')
	.trim()
	.toLocaleLowerCase();
}

function buildCardPriceURL (content, suffix, source) {
	if (!(source in sources)) {
		throw `unknown price source ${source}`;
	}
	return `${remote.cardPrice}/${content}/${suffix}?source=${source}`;
}

function buildLatestHighestURL (name, source) {
	return buildCardPriceURL(name, suffixes.LatestHighestSuffix, source);
}

function buildLatestLowestURL (name, source) {
	return buildCardPriceURL(name, suffixes.LatestLowestSuffix, source);
}

function buildLatestSpecificURL (name, set, source) {
	let content = `${name}/${set}`;
	return buildCardPriceURL(content, suffixes.LatestSpecificSuffix, source);
}

function buildWeeksMedianURL (name, set, source) {
	let content = `${name}/${set}`;
	return buildCardPriceURL(content, suffixes.WeeksMedianSuffix, source);
}

function buildClosestURL (name, set, closest, source) {
	let content = `${name}/${set}/${closest}`;
	return buildCardPriceURL(content, suffixes.ClosestSuffix, source);
}

// Set price URL builders
function buildSetPriceURL(setName, suffix, source) {
	if (!(source in sources)) {
		throw `unknown price source ${source}`;
	}
	return `${remote.setPrice}/${setName}/${suffix}?source=${source}`;
}

function buildCompleteLatestURL(name, source){
	return buildSetPriceURL(name, suffixes.LatestSpecificSuffix, source);
}

function buildExpectedValueURL(name, source){
	return buildSetPriceURL(name, suffixes.ExpectedValue, source);
}

// User endpoint URL builders
function buildUserURL(content) {
	return `${remote.users}/${content}`;
}

function buildLoginURL(name) {
	let content = `${name}/Login`;
	return buildUserURL(content);
}

// Fires an ajax request.
function ajaxJSON(method, url, body,
	success, failure) {

	var request = new XMLHttpRequest();

	request.open(method, url);
	request.setRequestHeader('Content-Type', 'application/json');

	request.onreadystatechange = function() {
	if (request.readyState === XMLHttpRequest.DONE ) {
			if(request.status === 200){
				success(request.response);
			}
			else if(request.status >= 400 && request.status <= 600) {
				failure();
			}
		}
	};

	request.send(body);
}

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

// Rounds a given 'n' to the first 'decimals' decimal places
function Truncate(n, decimals) {
  let coeff = Math.pow(10, decimals);

  return Math.floor(n * coeff) / coeff;
}

// Returns whether or not a provided username is valid.
//
// A valid username is at least a character but less than 30.
function validUsername(name) {
	return name.length > 0 && name.length < 30;
}

// Returns whether or not a provided password is valid.
//
// A valid password is at least 10 characters but less than
// 255
function validPassword(password) {
	return password.length >= 10 && password.length < 255;
}

// Converts a given official set name to a more pleasant display name.
function officialToDisplaySet(s) {
	return s
	.replace('Edition', '') // Clutter
	.replace('Limited', '') // Early sets
	.replace('Core Set', '') // Irregularly applied to core sets
	.replace('Magic: The Gathering—', '') // Conspiracy, EM dash
	.replace('Magic: The Gathering-', '') // Commander, hypen
	.replace(/  +/g, ' ') // Extraneous internal whitespace
	.trim(); // Extraneous external whitespace
}