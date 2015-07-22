(function () {

  // A commander staple appears in at least 10% of sampled decks
  const commanderStaple = 10.0;

  // A popular commander appears in at least 0.5% of sampled decks and
  // is legendary.
  const commanderGeneral = 0.5;

  // A tiny leaders general might see significantly less play than a regular
  // general due to lower mana cost in a high power format.
  const tinyLeader = commanderGeneral * 0.5;

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
    if (type.indexOf('Legendary Creature') != -1) return 'Popular General';

    if (play >= commanderStaple) return 'Commander Staple';

    // Anything that falls through to here can be all be labeled
    // with a nonspecific identity.
    return 'Commander Fringe';
  }

  // Given the % play a card sees in commander and its type,
  // returns true if it could be interesting in tiny leaders
  function getTinyLeadersAppeal(play, type) {
    if (play < tinyLeader  ) return false;
    if (type.indexOf('Legendary Creature') === -1) return false;

    return true;
  }

  // Given an array of decks played in modern,
  // this returns [input cleaned and sorted, median play across those decks].
  function cleanModernUse (decks) {
    // Filter out useless noise
    decks = decks.filter((d)=> d.Average >= 1);
    // Sort in ascending usage then reverse to descending.
    decks.sort((a, b)=> a.Average - b.Average).reverse()
    // Round them nicely to a single decimal point.
    decks.forEach((d)=>{
      d.Average = Truncate(d.Average, 1);
    });

    // Grab the median play.
    let median = 0.0;
    if (decks.length > 0) median = medianPlay(decks);

    return [decks, median];
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
      TinyLeadersAppeal: {
        type: Boolean,
        value: false,
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
      // Display settings
      _big: {
        type: Boolean,
        value: false,
      },
      // Flags for when we have interesting
      // content.
      _interestingContent: { // No interest whatsoever
        type: Boolean,
        value: false,
        computed: '_isInteresting(MedianModernPlay, CommanderUsage)',
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
      }
    },
    freshData: function(e){

      let Legalities = {};
      let Type = '';
      let rawCommanderUse = 0;

      ({
        Printings: this.Printings,
        SimilarCards: this.SimilarCards,
        Reserved: this.Reserved,
        CommanderUsage: rawCommanderUse,
        ModernPlay:{Decks: this.ModernDecks},
        Legalities, Type,
      } = e.detail);
    
      this.ModernBanned = Legalities.Modern !== 'Legal';
      this.LegacyBanned = Legalities.Legacy !== 'Legal';
      this.CommanderBanned = Legalities.Commander !== 'Legal';

      // Find our display name for the commander usage
      rawCommanderUse = rawCommanderUse * 100;
      this.CommanderUsage = Truncate(rawCommanderUse, 2);
      this.CommanderAppearance = getCommanderDisplay(rawCommanderUse, Type);
      this.TinyLeadersAppeal = getTinyLeadersAppeal(this.CommanderUsage, Type);

      [this.ModernDecks, this.MedianModernPlay] = cleanModernUse(this.ModernDecks);

    },
    _commanderInterest: function(CommanderUsage) {
      let commanderInteresting = false;

      // Any card better than the lowest tier worth considering
      // is also worth showing.
      if (CommanderUsage > commanderGeneral) commanderInteresting = true;

      return commanderInteresting
    },
    _modernInterest: function (MedianModernPlay) {
      let modernInteresting = false;

      // Any card that sees more than a median of a single copy
      // is worth showing
      if (MedianModernPlay > 1) modernInteresting = true;

      return modernInteresting
    },
    // Returns whether or not we have data interesting
    // enough to be worth displaying.
    _isInteresting: function(MedianModernPlay, CommanderUsage) {

      return this._modernInterest(MedianModernPlay) ||
             this._commanderInterest(CommanderUsage);

    }

  });
})();