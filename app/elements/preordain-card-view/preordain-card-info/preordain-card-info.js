(function () {

  // A commander staple appears in at least 10% of sampled decks
  const commanderStaple = 10.0;

  // A popular commander appears in at least 0.5% of sampled decks and
  // is legendary.
  const commanderGeneral = 0.5;

  // A year in seconds
  const year = 3600 * 24 * 365;

  // Returns the median of play that an array of sorted decks has. 
  function medianPlay(decks) {

    var half = Math.floor(decks.length/2);

    if(decks.length % 2)
        return decks[half].Average;
    else
        return (decks[half-1].Average + decks[half].Average) / 2.0;
  }

  // Given the % play a card sees in commander, this
  // returns a human friendly class it fits into.
  //
  // Returns an empty string on no fit.
  function getCommanderDisplay(play, type) {
    // commanderGeneral is the baseline amount of play
    if (play < commanderGeneral) return '';

    // Check if this is could be a general and opportunistically
    // assume that if it can be, then it is.
    if (type.indexOf('Legendary Creature') !== -1) return 'Popular General';

    if (play >= commanderStaple) return 'Commander Staple';

    // Anything that falls through to here can be all be labeled
    // with a nonspecific identity.
    return 'Commander Fringe';
  }

  // Given an array of decks played in modern,
  // this returns [input cleaned and sorted, median play across those decks].
  function cleanModernUse (decks) {
    // Filter out useless noise
    decks = decks.filter((d)=> d.Average >= 1);
    // Sort in ascending usage then reverse to descending.
    decks.sort((a, b)=> a.Average - b.Average).reverse();
    // Round them nicely to a single decimal point.
    decks.forEach((d)=>{
      d.Average = Truncate(d.Average, 1);
    });

    // Grab the median play.
    let median = 0.0;
    if (decks.length > 0) median = medianPlay(decks);

    return [decks, median];
  }

  // Given an array of printings for a card, returns the latest
  // time for that printing.
  function getLatestPrintingTime(printings) {
    // Map to set releases, removed sets without dates,
    // sort ascending then reverse.
    let dates = printings
    .map((set)=> displaySetReleases[set])
    .filter((t)=> t !== undefined)
    .sort((a, b)=> a - b)
    .reverse();

    // If none of the set times survived, return the current time.
    if (dates.length === 0) return (new Date() - 0)/ 1000;
    
    return dates[0];
  }

  Polymer({
    is: 'preordain-card-info',
    properties: {
      name: {
        type: String,
        value: '',
        notify: true,
      },
      // Data fetched remotely that is cleaned up.
      Reserved: {
        type: Boolean,
        value: false,
      },
      SimilarCards: {
        type: Array,
        value: ()=> [],
      },
      CommanderUsage: {
        type: Number,
        value: 0.0,
      },
      CommanderAppearance: {
        type: String,
        value: ' ',
      },
      ModernDecks: {
        type: Array,
        value: ()=> [],
      },
      MedianModernPlay: {
        type: Number,
        value: 0.0,
      },
      ModernBanned: {
        type: Boolean,
        value: false,
      },
      LegacyBanned: {
        type: Boolean,
        value: false,
      },
      CommanderBanned: {
        type: Boolean,
        value: false,
      },
      SinceLastPrint: { // Integer years since last printing.
        type: Number,
        value: 0,
      },
      // Display settings
      _big: {
        type: Boolean,
        value: false,
      },
      // Flags for when we have interesting
      // content.
      _interestingContent: { // Any interesting data to show.
        type: Boolean,
        value: false,
        // We need to state all dependencies here
        computed: '_isInteresting(MedianModernPlay, CommanderUsage, ModernBanned, LegacyBanned, CommanderBanned)',
      },
      _interestingCommander: { // Spicy commander usage
        type: Boolean,
        value: false,
        computed: '_commanderInterest(CommanderUsage)',
      },
      _interestingModern: { // Worthwhile modern results
        type: Boolean,
        value: false,
        computed: '_modernInterest(MedianModernPlay)',
      },
      _interestingBan: { // Worthwhile modern results
        type: Boolean,
        value: false,
        computed: '_banInterest(ModernBanned, LegacyBanned, CommanderBanned)',
      },
      _interestingSinceLastPrint: { // Last printing > some years ago
        type: Boolean,
        value: false,
        computed: '_timeSinceInterest(SinceLastPrint)',
      },
      _interestingBottom: {  
        type: Boolean,
        value: false,
        computed: '_bottomInterest(SinceLastPrint, ModernBanned, LegacyBanned, CommanderBanned)',
      }
    },
    freshData: function({detail}){

      let Legalities = {};
      let Type = '';
      let rawCommanderUse = 0;

      // [ignore] jshint seems to get unhappy with a
      // destructuring assignment that uses existing variables.
      /* jshint ignore:start */
      ({
        Printings: this.Printings,
        SimilarCards: this.SimilarCards,
        Reserved: this.Reserved,
        CommanderUsage: rawCommanderUse,
        ModernPlay:{Decks: this.ModernDecks},
        Legalities, Type,
      } = detail);
      /* jshint ignore:end */
    
      // Compute easy legalities
      Legalities.forEach((f)=> Legalities[f.Format] = f.Legality)
      this.ModernBanned = Legalities.Modern === 'Banned';
      this.LegacyBanned = Legalities.Legacy === 'Banned';
      this.CommanderBanned = Legalities.Commander === 'Banned';

      // Find our display name for the commander usage
      rawCommanderUse = rawCommanderUse * 100;
      this.CommanderUsage = Truncate(rawCommanderUse, 2);
      this.CommanderAppearance = getCommanderDisplay(rawCommanderUse, Type);

      [this.ModernDecks, this.MedianModernPlay] = cleanModernUse(this.ModernDecks);

      // Find how long its been since this was last in a major
      // printing
      let now = (new Date() - 0)/ 1000;
      let secondsSince = now - getLatestPrintingTime(this.Printings);

      // Convert to years
      this.SinceLastPrint = Truncate(secondsSince / year, 0);
    },
    _commanderInterest: function(CommanderUsage) {
      let commanderInteresting = false;

      // Any card better than the lowest tier worth considering
      // is also worth showing.
      if (CommanderUsage > commanderGeneral) commanderInteresting = true;

      return commanderInteresting;
    },
    _modernInterest: function (MedianModernPlay) {
      let modernInteresting = false;

      // Any card that sees more than a median of a single copy
      // is worth showing
      if (MedianModernPlay > 1) modernInteresting = true;

      return modernInteresting;
    },
    _banInterest: function(ModernBanned,
      LegacyBanned, CommanderBanned) {
      

      return ModernBanned || LegacyBanned || CommanderBanned;
    },
    _timeSinceInterest: function(SinceLastPrint) {
      // A card that was printed at least two years ago
      // is worthwhile to note.
      return SinceLastPrint >= 2;
    },
    _bottomInterest: function(SinceLastPrint,
      ModernBanned, LegacyBanned, CommanderBanned) {
      
      return this._timeSinceInterest(SinceLastPrint) ||
             this._banInterest(ModernBanned, LegacyBanned, CommanderBanned);
    },
    // Returns whether or not we have data interesting
    // enough to be worth displaying.
    _isInteresting: function(MedianModernPlay,
      CommanderUsage, ModernBanned, LegacyBanned, CommanderBanned) {

      // Note: SinceLastPrint is not inherently interesting
      // on its own so we do not take it into consideration when
      // determining if a card has sufficiently spicy context.

      return this._modernInterest(MedianModernPlay) ||
             this._commanderInterest(CommanderUsage) ||
             this._banInterest(ModernBanned, LegacyBanned, CommanderBanned);

    }

  });
})();