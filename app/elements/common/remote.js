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

let urlBuilders = {};

{
	urlBuilders.ImageURL = (imageName) => {
		return `${remote.cardImage}${imageName}.jpg`;
	};

	// Card price URL builders
	urlBuilders.CardURL = (cardName) => {
		return `${remote.cardText}${cardName}.json`;
	};

	urlBuilders.SymbolURL = (symbolName) => {
		let cleaned = symbolName.toLocaleLowerCase().replace('/', '');
		return `${remote.cardSymbol}${cleaned}.svg`;
	};

	urlBuilders.SetSymbolURL = (setName) => {
		// Convert to official then normalize to server representation.
		let cleaned = displayToOfficialSets[setName]
		.replace('/', '')
		.replace('Foil', '')
		.trim();
		
		return `${remote.cardSymbol}${cleaned}.svg`;
	};

	urlBuilders.CardPriceURL = (content, suffix, source) => {
		if (!(source in sources)) {
			throw `unknown price source ${source}`;
		}
		return `${remote.cardPrice}/${content}/${suffix}?source=${source}`;
	};

	urlBuilders.LatestHighestURL = (name, source) => {
		return urlBuilders.CardPriceURL(name,
			priceSuffixes.LatestHighestSuffix, source);
	};

	urlBuilders.LatestLowestURL = (name, source) => {
		return urlBuilders.CardPriceURL(name,
			priceSuffixes.LatestLowestSuffix,
			source);
	};

	urlBuilders.LatestSpecificURL = (name, set, source) => {
		let content = `${name}/${set}`;
		return urlBuilders.CardPriceURL(content,
			priceSuffixes.LatestSpecificSuffix,
			source);
	};

	urlBuilders.WeeksMedianURL = (name, set, source) => {
		let content = `${name}/${set}`;
		return urlBuilders.CardPriceURL(content,
			priceSuffixes.WeeksMedianSuffix, source);
	};

	urlBuilders.ClosestURL =  (name, set, closest, source) => {
		let content = `${name}/${set}/${closest}`;
		return urlBuilders.CardPriceURL(content,
			priceSuffixes.ClosestSuffix, source);
	};

	// Set price URL builders
	urlBuilders.SetPriceURL = (setName, suffix, source) => {
		if (!(source in sources)) {
			throw `unknown price source ${source}`;
		}
		return `${remote.setPrice}/${setName}/${suffix}?source=${source}`;
	};

	urlBuilders.CompleteLatestURL = (name, source) => {
		return urlBuilders.SetPriceURL(name,
			priceSuffixes.LatestSpecificSuffix, source);
	};

	urlBuilders.ExpectedValueURL = (name, source) => {
		return urlBuilders.SetPriceURL(name, priceSuffixes.ExpectedValue, source);
	};

	// User endpoint URL builders
	urlBuilders.UserURL = (content) => {
		return `${remote.users}/${content}`;
	};

	urlBuilders.LoginURL = (name) => {
		let content = `${name}/Login`;
		return urlBuilders.UserURL(content);
	};

	urlBuilders.SignupURL = (name) => {
		let content = `${name}`;
		return urlBuilders.UserURL(content);
	};

	// Requests a reset token
	urlBuilders.ResetRequestURL = (name) => {
		let content = `${name}/PasswordResetRequest`;
		return urlBuilders.UserURL(content);
	};

	// Actually performs the reset request
	urlBuilders.ResetURL = (name) => {
		let content = `${name}/PasswordReset`;
		return urlBuilders.UserURL(content);
	};

	urlBuilders.TradesURL = (name, coll, pub) => {
		let content = `${name}/Collections/${coll}/Get`;
		// Appending 'Public' to the end of this endpoint lets us switch
		// authentication on or off.
		if (pub) content = content.concat('Public');
		return urlBuilders.UserURL(content);
	};

	// Fetches collection list
	urlBuilders.CollectionsURL = (name) => {
		let content = `${name}/Collections/${coll}/Get`;
		return urlBuilders.UserURL(content);
	};

	// Adds a collection
	urlBuilders.AddCollectionURL = (name, coll) => {
		let content = `${name}/Collections/${coll}/Create`;
		return urlBuilders.UserURL(content);
	};

	// Adds an item to a trade
	urlBuilders.AddItemURL = (name, coll) => {
		let content = `${name}/Collections/${coll}/Trades`;
		return urlBuilders.UserURL(content);
	};
}