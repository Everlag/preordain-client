(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
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
        value: ()=>[],
        notify: true,
      }
    },
    gotPrices: function(e){
      console.log(e.detail);
      this.prices = e.detail;
    }


  });
})();