(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Fires the 'prices-down' event upon completion.
    is: 'price-complete',
    properties: {
      // Filters
      name: {
        type: String,
        value: ' ',
        notify: true,
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
      this.fire('prices-down', this.prices);
    }


  });
})();