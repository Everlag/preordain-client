(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'price-closest',
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