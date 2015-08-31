// Trade decoration and normalization


// Computes an array of lines from a single comment.
//
// Aims to wrap lines on word endings around the 'limit'th character
function getCommentLines(comment, limit) {

	// The easy exit
	if (comment.length <= limit) return [comment];

	// Cleanly wrap the comment at the ~limit
	let breaks = new Set(['.', '!', '?', ' ']);
	let lines = [];

	let wrapNextWord = false;
	let lastWrap = 0;
	let i = 0;
	for (let c of comment){
		if ((i - lastWrap) > limit) wrapNextWord = true;

		if (wrapNextWord && breaks.has(c)) {
			lines.push(comment.substring(lastWrap, i).trim());

			wrapNextWord = false;
			lastWrap = i;
		}
		i++;
	}
	// Push the remainder of the comment if it wasn't perfectly divisible
	// by the limit.
	if (lastWrap < comment.length) {
		// Ensure we aren't just appending whitespace or a line ending.
		let remainder = comment.substring(lastWrap, comment.length).trim();

		if (!breaks.has(remainder)) lines.push(remainder);
	}
	return lines;

}

// Computes a clean string that presents the user
// with a reasonable concept of how long it has been since an action
// has taken place.
//
// difference is the millisecond difference between the action and now
// while Time is a Date object for the action.
function getTimeString(difference, Time) {
	let weekDiff = difference / (millisPerHour * 24 * 7);

	let duration;
	let suffix = '';

	// Anything beyond 2 weeks becomes the date.
	//
	// This is the early exit that we'll hit for the majority of
	// cases.
	if (weekDiff >= 2) {
		return Time.toDateString();
	}

	let hourDiff = difference / millisPerHour;
	if (hourDiff < 1) {
		// Anything less than an hours is minutes
		duration = Truncate(difference / (millisPerHour / 60), 0);
		if (duration > 1) suffix = 's';
		return `${duration} Minute${suffix}`;
	}

	if (hourDiff <= 24) {
		// Anything less than a day is hours
		duration = Truncate(hourDiff, 0);
		if (duration > 1) suffix = 's';
		return `${duration} Hour${suffix}`;
	}
	
	// Anything above a day is measured in days
	duration = Truncate(difference / (millisPerHour * 24), 0);
	if (duration > 1) suffix = 's';
	return `${duration} Day${suffix}`;

}

// Build trades from an array of individual trade items.
//
// A trade has items which have identical comments as well as
// dates that differ by no more than a year.
//
// The returned trades are sorted by time and individual items in trades
// are sorted by decreasing quantity.
//
// Normalization of set names to our internal format is performed.
const millisPerHour = 1000 * 3600;
function buildTrades(tradeItems) {

	// Copy the items so we don't mutate the passed array
	let drain = tradeItems.slice();
	
	// Add native dates to each trade item
	drain.forEach((i)=>{
		i.Time = new Date(i.LastUpdate); // Precompute date
		// Precompute the server's epoch timestamp.
		i.TimeInt = Truncate(i.Time / 1000, 0);
		i.Set = officialToDisplaySet(i.Set); // Normalize
	});

	let trades = [];

	while (drain.length > 0){
		let seed = drain[0];
		let seedDate = seed.Time;

		// Filter trade items into the trade.
		let trade = drain.filter((i)=>{
			let itemDate = i.Time;
			let dateDiff = Math.abs(itemDate - seedDate) / millisPerHour;
			return i.Comment === seed.Comment && dateDiff <= 24;
		});

		trades.push(trade);

		// Filter trade items out of the drain.
		drain = drain.filter((i)=> trade.indexOf(i) === -1);
	}

	// Decreasing quantity for trade items
	trades.forEach((t)=> t.sort((a, b)=> b.Quantity - a.Quantity));

	// Latest to oldest for trades.
	return trades.sort((a, b)=> a[0].Time - b[0].Time).reverse();

}

// Adds metadata to each trade item to assist with usability.
//
// Assumes each trade has been built with buildTrades.
function addTradesUX(trades) {

	let now = new Date();

	trades.forEach((t)=>{

		// Add a nice date string.
		let difference = Math.abs(now - t[0].Time);
		t.TimeString = getTimeString(difference, t[0].Time);

		// Determine if we can append to this trade
		t.Appendable = (difference / millisPerHour) <= 24;

		// Add a convenient date int
		t.TimeInt = t[0].TimeInt;

		// Wrap the comment at ~50 character lines
		t.CommentLines = getCommentLines(t[0].Comment, 60);

		t.forEach((i)=>{
			// Positive or negative Quantity for layout
			if (i.Quantity >= 0) {
				i.Positive = true;
			}else{
				i.Positive = false;
			}
		});
	});

	return trades;
}

// Inserts every set release that has happened within the
// the bounds into an array where they sit inline with trades
//
// Trades are distinctly marked with the 'isTrade' property
//
// This does mutate the provided array and its items.
//
// Assumes each trade has gone through the buildTrades and
// addTradesUX pipeline
function decorateTrades(trades) {

	// Label each trade as a trade
	trades.forEach((t)=> t.isTrade = true);

	// Sort the trades earliest to latest
	trades.sort((a, b)=> a.TimeInt - b.TimeInt);
	let oldest = trades[0].TimeInt;
	let latest = trades[trades.length - 1].TimeInt;

	// Get the sets formatted as trades but filter out those
	// that don't fall between the earliest and latest trades
	let sets = [];
	for (let set in displaySetReleases){
		let TimeInt = displaySetReleases[set];
		if (TimeInt > latest || TimeInt < oldest) continue;

		sets.push({
				Name: set,
				TimeInt: TimeInt,
				isTrade: false,
			});
	}

	// Add the valid sets to the trades
	let decorated = trades.concat(sets);

	// Sort by increasing TimeInt then reverse
	decorated.sort((a, b)=> a.TimeInt - b.TimeInt);
	decorated.reverse();

	// Clump any sets discovered into an array
	// so that it may display horizontally
	//
	// We clump up to 3 sets at a time.
	let clumped = []; // All the sets and trades
	let clump = []; // Some sets
	decorated.forEach((d)=>{
		clump.isTrade = false;

		// Simply push anything in the clump
		// and then the trades
		if (d.isTrade){
		if (clump.length > 0) clumped.push(clump);
		// We can clear the clump in any case
		clump = [];
		clumped.push(d);
		return;
		}

		// Add to any reasonably sized clump.
		if (clump.length <= 2){
		clump.push(d);
		return;
		}

		// Clear the current clump if it is full
		clumped.push(clump);
		// Then add this set
		clump = [d];

	});
	// We never have sets beyond the end of trades
	// so we need not worry about emptying the clump.

	return clumped;
}