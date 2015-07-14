(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'price-latest',
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
      price: {
        type: Number,
        value: NaN,
        notify: true,
      }
    },
    gotPrice: function(e){
      this.price = e.detail.Price;
      this.fire('display-price', this.price);
    }


  });
})();