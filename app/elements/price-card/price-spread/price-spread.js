(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'price-spread',
    properties: {
      // Filters
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      set: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      // The source to use as a basis of comparison
      primary: {
        type: String,
        value: sources.mtgprice,
        notify: true,
      },
      // The source to compare to the base
      secondary: {
        type: String,
        value: sources.mkm,
        notify: true,
      },
      // Result of the spread
      price: {
        type: Number,
        value: NaN,
        notify: true,
      }
    },
    attached: function(){
      // Set the state to the default
      this._reset();
    },
    _facetChanged: function(){
      // Throw away the prices we have acquired
      // that are stale
      this._reset();
    },
    _reset: function(){
      // Scrub the internal state
      this._prices = [0,0];
    },
    gotSpread: function(e){
      let [primary, secondary] = this._prices;
      this.price = primary - secondary;
      this.fire('display-price', this.price);
    },
    gotPrice: function(e){

      let {Name, Price, Set:set, Source} = e.detail;
      
      // Figure out if the source is valid and which
      // price slot it should populate
      let validSource = true;
      if (Source === this.primary) {
        this._prices[0] = Price;
      }else if (Source === this.secondary){
        this._prices[1] = Price;
      }else{
        validSource = false;
      }

      // Make sure we get a non-stale price
      let invalid = Name !== this.name ||
                  officialToDisplaySet(set) !== this.set ||
                  !validSource;
      if (invalid) return;

      // If we have both prices, we're good.
      if (this._prices.every((p)=> p > 0)) this.gotSpread();
    }


  });
})();