
// A holster for all globally mutable state.
//
// Only variables whose storage in non-global scope would
// be prohibitively expensive or prone to significant mental overhead
// can be reasonably kept here.
let mutable = {
	// The global source all price sources fetch from.
	priceSource: sources.mtgprice,
};