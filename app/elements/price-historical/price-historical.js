(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Fires the 'historical-prices' when complete.
    is: 'price-historical',
    properties: {
      // Filters
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      set: {
        type: String,
        value: ' ',
        notify: true,
      },
      // Price source options
      mkmSource: {
        type: Boolean,
        value: false,
      },
      // Result
      prices: {
        type: Array,
        value: ()=> [],
        notify: true,
      }
    },
    gotPrices: function(e){
      if (e.detail.length === undefined) return;
      this.prices = e.detail;
      this.fire('historical-prices', this.prices);
    }


  });
})();