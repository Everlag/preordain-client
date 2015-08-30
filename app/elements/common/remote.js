// Generation of URIs


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
const priceSuffixes = {
	LatestHighestSuffix: 'LatestHighest',
	LatestLowestSuffix: 'LatestLowest',
	LatestSpecificSuffix: 'Latest',
	WeeksMedianSuffix: 'WeeksMedian',
	ClosestSuffix: 'Closest',
	ExpectedValue: 'EV',
};

function buildImageURL (imageName) {
	return `${remote.cardImage}${imageName}.jpg`;
}

// Card price URL builders
function buildCardURL(cardName) {
	return `${remote.cardText}${cardName}.json`;
}

function buildSymbolURL (symbolName) {
	let cleaned = symbolName.toLocaleLowerCase().replace('/', '');
	return `${remote.cardSymbol}${cleaned}.svg`;
}

function buildSetSymbolURL (setName){
	// Convert to official then normalize to server representation.
	let cleaned = displayToOfficialSets[setName]
	.replace('/', '')
	.replace('Foil', '')
	.trim();
	
	return `${remote.cardSymbol}${cleaned}.svg`;
}

function buildCardPriceURL (content, suffix, source) {
	if (!(source in sources)) {
		throw `unknown price source ${source}`;
	}
	return `${remote.cardPrice}/${content}/${suffix}?source=${source}`;
}

function buildLatestHighestURL (name, source) {
	return buildCardPriceURL(name, priceSuffixes.LatestHighestSuffix, source);
}

function buildLatestLowestURL (name, source) {
	return buildCardPriceURL(name,
		priceSuffixes.LatestLowestSuffix,
		source);
}

function buildLatestSpecificURL (name, set, source) {
	let content = `${name}/${set}`;
	return buildCardPriceURL(content,
		priceSuffixes.LatestSpecificSuffix,
		source);
}

function buildWeeksMedianURL (name, set, source) {
	let content = `${name}/${set}`;
	return buildCardPriceURL(content, priceSuffixes.WeeksMedianSuffix, source);
}

function buildClosestURL (name, set, closest, source) {
	let content = `${name}/${set}/${closest}`;
	return buildCardPriceURL(content, priceSuffixes.ClosestSuffix, source);
}

// Set price URL builders
function buildSetPriceURL(setName, suffix, source) {
	if (!(source in sources)) {
		throw `unknown price source ${source}`;
	}
	return `${remote.setPrice}/${setName}/${suffix}?source=${source}`;
}

function buildCompleteLatestURL(name, source){
	return buildSetPriceURL(name, priceSuffixes.LatestSpecificSuffix, source);
}

function buildExpectedValueURL(name, source){
	return buildSetPriceURL(name, priceSuffixes.ExpectedValue, source);
}

// User endpoint URL builders
function buildUserURL(content) {
	return `${remote.users}/${content}`;
}

function buildLoginURL(name) {
	let content = `${name}/Login`;
	return buildUserURL(content);
}

function buildSignupURL(name) {
	let content = `${name}`;
	return buildUserURL(content);
}

// Requests a reset token
function buildResetRequestURL(name) {
	let content = `${name}/PasswordResetRequest`;
	return buildUserURL(content);
}

// Actually performs the reset request
function buildResetURL(name) {
	let content = `${name}/PasswordReset`;
	return buildUserURL(content);
}

function buildTradesURL(name, coll, pub) {
	let content = `${name}/Collections/${coll}/Get`;
	// Appending 'Public' to the end of this endpoint lets us switch
	// authentication on or off.
	if (pub) content = content.concat('Public');
	return buildUserURL(content);
}

// Fetches collection list
function buildCollectionsURL(name) {
	let content = `${name}/Collections/${coll}/Get`;
	return buildUserURL(content);
}

// Adds a collection
function buildAddCollectionURL(name, coll) {
	let content = `${name}/Collections/${coll}/Create`;
	return buildUserURL(content);
}

// Adds an item to a trade
function buildAddItemURL(name, coll) {
	let content = `${name}/Collections/${coll}/Trades`;
	return buildUserURL(content);
}