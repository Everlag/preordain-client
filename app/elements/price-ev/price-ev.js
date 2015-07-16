(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Fires the 'display-price' event with ev
    // and the 'prices-down' event with the complete details.
    is: 'price-ev',
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
      total: {
        type: Object,
        value: NaN,
        notify: true,
      }
    },
    gotPrice: function(e){
      this.total = e.detail;
      this.fire('display-price', this.total.EV);
      this.fire('prices-down', this.total);
    }


  });
})();