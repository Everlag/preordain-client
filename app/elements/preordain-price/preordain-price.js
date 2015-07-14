(function () {
  Polymer({
    // A display tag for preorda.in prices.
    //
    // Typical usage is making the content an element that emits the
    // 'display-price' event whose detail is a single price measured in cents.
    is: 'preordain-price',
    properties: {
      // Result
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
    },
    attached: function(){
      // Listen for any price events inside of the entire element.
      this.addEventListener("display-price", this.gotPrice);
    },
    gotPrice: function(e){
      this.price = e.detail / 100;
    },
    _hasPrice: function(price){
      if (isNaN(price)) return false;
      return true;
    },
    _noPrice: function(price){
      return !(this._hasPrice(price));
    }


  });
})();