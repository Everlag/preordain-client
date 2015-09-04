(function () {
  Polymer({
    // A display tag for preorda.in prices.
    //
    // Typical usage is making the content an element that emits the
    // 'display-price' event whose detail is a single price measured in cents.
    is: 'preordain-price',
    properties: {
      // Raw Result
      price: {
        type: Number,
        value: NaN,
        notify: true,
      },
      // Display settings
      showUsd: {
        type: Boolean,
        value: false,
      },
      multiplier: { // Display value coefficient, optional.
        type: Number,
        value: 1,
      },
      // Clean transitions
      hasPrice: {
        type: Boolean,
        value: false,
        computed: '_hasPrice(price)'
      },
      noPrice: {
        type: Boolean,
        value: true,
        computed: '_noPrice(price)'
      },
      // Computed display settings
      negative: {
        type: Boolean,
        value: false,
        computed: 'isNegative(price)'
      },
      displayPrice: {
        type: Number,
        value: NaN,
        computed: 'abs(price)'
      }
    },
    attached: function(){
      // Listen for any price events inside of the entire element.
      this.addEventListener('display-price', this.gotPrice);
      this.addEventListener('stale-price', this.stalePrice);
    },
    // Sets the current price to the number of provided cents
    setPrice: function(price) {
      price = price / 100;
    
      this._handlePrice(price);
    },
    gotPrice: function(e){
      // Convert from cents.
      let price = e.detail / 100;

      this._handlePrice(price);
    },
    _handlePrice: function(price) {
      // Apply multiplier and round to two decimal places initially.
      price = Truncate(this.multiplier * price, 2);
    
      // Round to once decimal place if the price is longer than 3 digits
      if (String(price).length > 4){
        price = Truncate(price, 1);
      }
      // Round out the decimals if the price is still overly long
      if (String(price).length > 4){
        price = Truncate(price, 0);
      }

      this.price = price;
    },
    stalePrice: function(){
      // We are holding onto an invalid price!
      this.price = NaN;
    },
    _hasPrice: function(price){
      if (isNaN(price)) return false;
      return true;
    },
    _noPrice: function(price){
      return !(this._hasPrice(price));
    },
    isNegative: function(price) {
      return price < 0;
    },
    abs: function(price) {
      return Math.abs(price);
    },


  });
})();