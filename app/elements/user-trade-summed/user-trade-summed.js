(function () {

  // Turns a card-set combination into a
  // valid price map key
  function toPriceMapKey(name, set) {
    return `${name}|${set}`;
  }

  Polymer({
    // A wrapper for access to preorda.in pricing.
    // that can be fed a trade.
    //
    // Events are fired when we are successful
    is: 'user-trade-summed',
    properties: {
      // An array of objects
      //
      // These must have the Name and Set properties.
      // They can optionally have the (Number) TimeInt property
      // if useDate is true.
      cards: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      // Whether or not to use the date on each item.
      //
      // Each object of cards must have the Time property
      //
      // This property needs to be static after the element is initialized
      // in order to ensure proper functioning.
      useDate: {
        type: Boolean,
        value: false,
      },
      // Result
      price: {
        type: Number,
        value: NaN,
        notify: true,
      }
    },
    attached: function(){
      // We keep a record of all the prices we've
      // seen.
      //
      // Price map keys are strings of the form
      //    'card|set'
      // which causes differing dates to override.
      this._priceMap = {};
      // Which card-set combinations we've already gotten.
      this._acquired = new Set();
    },
    gotPrice: function(e){
      // Normalize the set to our display names
      let set = officialToDisplaySet(e.detail.Set);
      let name = e.detail.Name;
      let key = toPriceMapKey(name, set);

      // Record the details of what we have
      this._acquired.add(key);
      this._priceMap[key] = e.detail.Price;

      // Signal that we may have enough prices to compute the
      // trade's value.
      if (this._acquired.size >= this.cards.length){
        this._computePrice();
      }
    },
    // Attempts to compute the value of a trade
    //
    _computePrice: function() {
      let computed = 0; // The computed price
      let found = 0; // How many valid prices we found
      // Go through the current trade and fetch what we have.
      this.cards.forEach((c)=>{
        // Ensure we have a price entry before querying for a price
        let key  = toPriceMapKey(c.Name, c.Set);
        if (!this._acquired.has(key)) return;

        computed+= this._priceMap[key] * c.Quantity;

        found++;
      });

      // Exit if we were prompted to generate a price too early
      if (found < this.cards.length) return;

      this.price = computed;
      // Let whoever is holding onto this price know
      // that it has been computed.
      this.fire('display-price', this.price);
    }


  });
})();