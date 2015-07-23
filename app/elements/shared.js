// Store all remote urls so we don't overly pollute global scope
const remote = {
	cardText: 'https://beta.perfectlag.me/cardText/',
	cardSymbol: 'https://beta.perfectlag.me/cardSymbols/',
	cardImage: 'https://beta.perfectlag.me/cardImages/',
	cardPrice: 'https://beta.perfectlag.me/api/Prices/Card',
	setPrice: 'https://beta.perfectlag.me/api/Prices/Set',
	typeAhead: 'https://beta.perfectlag.me/typeAhead/%QUERY.json',
};

// Store all the suffixes here.
const suffixes = {
	LatestHighestSuffix: 'LatestHighest',
	LatestLowestSuffix: 'LatestLowest',
	LatestSpecificSuffix: 'Latest',
	WeeksMedianSuffix: 'WeeksMedian',
	ClosestSuffix: 'Closest',
	ExpectedValue: 'EV',
}

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
	cardName = cardName.split("//")[0]

	return cardName
	.replace(':', '')
	.replace('AE', 'Æ')
	.trim()
	.toLocaleLowerCase();
}

function buildCardPriceURL (content, suffix, source) {
	if (!(source in sources)) {
		throw `unknown price source ${source}`;
	};
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
	};
	return `${remote.setPrice}/${setName}/${suffix}?source=${source}`;
}

function buildCompleteLatestURL(name, source){
	return buildSetPriceURL(name, suffixes.LatestSpecificSuffix, source);
}

function buildExpectedValueURL(name, source){
	return buildSetPriceURL(name, suffixes.ExpectedValue, source);
}

// Rounds a given 'n' to the first 'decimals' decimal places
function Truncate(n, decimals) {
  let coeff = Math.pow(10, decimals);

  return Math.floor(n * coeff) / coeff;
}