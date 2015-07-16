(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
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
    }


  });
})();