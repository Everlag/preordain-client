(function () {

  // Substrings undesirable sets may have.
  const badSets = ['Promo', 'Friday', 'Prix', 'Duel', 'Media', 'Gift',
  'Event', 'From the Vault'];

  // Selects a printing that would have sane data.
  //
  // A preference is provided that is chosen if available.
  //
  // Sometimes promo sets get unhinged in terms of mtgprice.
  function selectSet(printings, preference) {

    if (printings.length === 0) throw 'No valid printings';

    // Choose the preference if it's valid.
    if (printings.indexOf(preference) !== -1) return preference;

    // Default to the first set if we
    // can't find a more desirable one.
    let fallback = printings[0];

    // Grab the first reasonable set
    for (let p of printings){
      let valid = true;

      for (let bad of badSets){
        if (p.indexOf(bad) !== -1){
          valid = false;
          break;
        }
      }

      if (valid) return p;
    }

    return fallback;

  }

  Polymer({
    // A view of all price data relevant for a specific card.
    is: 'preordain-printing-selector',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      set: { // The preferred set we work off of, a hint.
        type: String,
        value: ' ',
        notify: true,
      },
      selected: { // Which set are dealing with
        type: String,
        value: ' ',
        notify: true,
      },
      _printings: {
        type: Array,
        value: ()=> [],
      }
    },
    newData: function({detail:{Printings}}) {
      // Grab all the valid printings for this card.
      this._printings = Printings.filter((p)=> displaySets.has(p));

      // Choose one to display
      this.selected = selectSet(this._printings, this.set);

      // Clear any existing preferences.
      this.set = ' ';
    },


  });
})();