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
const sources = {'mkm': 'mkm', 'mtgprice': 'mtgprice'};

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


// Bulk data goes down here
const setList = new Set([
  "Magic Origins",
  "Magic Origins Foil",
  "Starter 2000",
  "Gatecrash Foil",
  "Fourth Edition",
  "Commander 2014",
  "From the Vault: Twenty",
  "Khans of Tarkir Foil",
  "Morningtide",
  "Premium Deck Series: Graveborn",
  "Duel Decks: Phyrexia vs. the Coalition",
  "Player Rewards",
  "Ninth Edition",
  "Gatecrash",
  "Future Sight Foil",
  "Duel Decks: Sorin vs. Tibalt",
  "Legions",
  "Time Spiral Foil",
  "Antiquities",
  "Duel Decks: Izzet vs. Golgari",
  "Odyssey",
  "Duel Decks: Elves vs. Goblins",
  "Mirrodin Besieged Foil",
  "Ice Age",
  "Apocalypse Foil",
  "Duel Decks: Elspeth vs. Tezzeret",
  "Magic 2010",
  "Duel Decks: Knights vs. Dragons",
  "Portal Three Kingdoms",
  "Seventh Edition Foil",
  "Scourge",
  "Portal",
  "Scourge Foil",
  "Urza's Destiny Foil",
  "Zendikar Foil",
  "Born of the Gods",
  "Tempest",
  "Fallen Empires",
  "From the Vault: Dragons",
  "Unlimited Edition",
  "Guru",
  "The Dark",
  "Guildpact",
  "Mercadian Masques Foil",
  "Planechase",
  "Grand Prix",
  "Darksteel Foil",
  "Magic: The Gathering—Conspiracy",
  "Avacyn Restored",
  "Tenth Edition Foil",
  "Limited Edition Alpha",
  "Urza's Legacy",
  "Betrayers of Kamigawa Foil",
  "Conflux",
  "Mercadian Masques",
  "Ravnica: City of Guilds",
  "Duel Decks: Jace vs. Vraska",
  "Champions of Kamigawa",
  "Alara Reborn Foil",
  "Planar Chaos",
  "Planeshift Foil",
  "Return to Ravnica",
  "Shards of Alara",
  "Journey into Nyx Foil",
  "Dissension Foil",
  "Time Spiral \"Timeshifted\"",
  "Commander 2013 Edition",
  "From the Vault: Annihilation",
  "Alara Reborn",
  "Exodus",
  "Saviors of Kamigawa Foil",
  "Champions of Kamigawa Foil",
  "Magic: The Gathering—Conspiracy Foil",
  "Unglued",
  "Scars of Mirrodin Foil",
  "From the Vault: Relics",
  "From the Vault: Exiled",
  "Classic Sixth Edition",
  "Return to Ravnica Foil",
  "Duel Decks: Divine vs. Demonic",
  "Invasion",
  "Avacyn Restored Foil",
  "Ninth Edition Foil",
  "Commander's Arsenal",
  "Onslaught",
  "Prerelease Events",
  "Arabian Nights",
  "Eighth Edition",
  "Duel Decks: Jace vs. Chandra",
  "Battle Royale Box Set",
  "Revised Edition",
  "Stronghold",
  "Urza's Legacy Foil",
  "Nemesis",
  "Fate Reforged Foil",
  "Legends",
  "Fate Reforged",
  "Dragon's Maze",
  "Unhinged Foil",
  "Onslaught Foil",
  "Zendikar",
  "Starter 1999",
  "Duel Decks: Venser vs. Koth",
  "Saviors of Kamigawa",
  "Judgment Foil",
  "Limited Edition Beta",
  "Magic 2012 Foil",
  "Legions Foil",
  "Odyssey Foil",
  "Fifth Dawn",
  "Visions",
  "Mirrodin Besieged",
  "Mirrodin Foil",
  "Invasion Foil",
  "Magic 2010 Foil",
  "Alliances",
  "Magic 2014 Core Set Foil",
  "Planechase 2012 Edition",
  "Modern Masters Foil",
  "Torment Foil",
  "Theros Foil",
  "Pro Tour",
  "Guildpact Foil",
  "Duel Decks: Ajani vs. Nicol Bolas",
  "Judgment",
  "Premium Deck Series: Slivers",
  "Fifth Edition",
  "Time Spiral \"Timeshifted\" Foil",
  "Time Spiral",
  "Coldsnap",
  "Magic 2013 Foil",
  "Duel Decks: Garruk vs. Liliana",
  "Magic 2015 Core Set",
  "Mirage",
  "Betrayers of Kamigawa",
  "Duel Decks: Heroes vs. Monsters",
  "Magic 2012",
  "Lorwyn",
  "Deckmasters",
  "Dark Ascension",
  "Worldwake Foil",
  "Born of the Gods Foil",
  "Weatherlight",
  "New Phyrexia",
  "Judge Gift Program",
  "Rise of the Eldrazi Foil",
  "Modern Masters 2015 Edition Foil",
  "Friday Night Magic",
  "Planar Chaos Foil",
  "Lorwyn Foil",
  "Innistrad",
  "Khans of Tarkir",
  "Dragon's Maze Foil",
  "Scars of Mirrodin",
  "Dissension",
  "Prophecy",
  "Future Sight",
  "Beatdown Box Set",
  "Theros",
  "Magic 2011",
  "Torment",
  "Media Inserts",
  "Happy Holidays",
  "Shadowmoor",
  "Coldsnap Foil",
  "Urza's Destiny",
  "Homelands",
  "Prophecy Foil",
  "Dark Ascension Foil",
  "Shadowmoor Foil",
  "Darksteel",
  "Archenemy",
  "Tenth Edition",
  "Modern Masters 2015 Edition",
  "From the Vault: Legends",
  "Innistrad Foil",
  "Rise of the Eldrazi",
  "Worldwake",
  "Magic 2015 Core Set Foil",
  "Journey into Nyx",
  "Launch Parties",
  "Conflux Foil",
  "Mirrodin",
  "Eventide Foil",
  "Dragons of Tarkir Foil",
  "Magic 2011 Foil",
  "Apocalypse",
  "Portal Second Age",
  "Shards of Alara Foil",
  "Game Day",
  "Nemesis Foil",
  "Chronicles",
  "Magic 2014 Core Set",
  "Magic: The Gathering-Commander",
  "Fifth Dawn Foil",
  "Dragons of Tarkir",
  "Premium Deck Series: Fire and Lightning",
  "Magic 2013",
  "From the Vault: Realms",
  "Urza's Saga",
  "New Phyrexia Foil",
  "Unhinged",
  "Eventide",
  "Planeshift",
  "Modern Masters",
  "Duels of the Planeswalkers",
  "Eighth Edition Foil",
  "Morningtide Foil",
  "Ravnica: City of Guilds Foil",
  "Seventh Edition"
 ]);


const initialImage = 'data:image/jpg;base64,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'