(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Fires no event when complete
    is: 'price-complete',
    properties: {
      // Filters
      name: {
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
        value: NaN,
        notify: true,
      }
    },
    gotPrice: function(e){
      this.prices = e.detail;
    }


  });
})();