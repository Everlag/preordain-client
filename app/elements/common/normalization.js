// Conversions from external to our internal represenations


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
	.replace(/\(.*?\)/g, '')
	.trim()
	.toLocaleLowerCase();
}

// Rounds a given 'n' to the first 'decimals' decimal places
function Truncate(n, decimals) {
  let coeff = Math.pow(10, decimals);

  return Math.floor(n * coeff) / coeff;
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