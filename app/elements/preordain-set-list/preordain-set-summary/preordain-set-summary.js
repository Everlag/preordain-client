(function () {
  Polymer({
    // A full list of supported sets
    is: 'preordain-set-summary',
    properties: {
      name: {
        type: String,
        value: ' ',
      },
      _mostExpensive: {
        type: String,
        value: ' ',
      },
    },
    attached: function() {

    },
    pricesDown: function(e) {

      // We work with the assumption that the returned
      // prices are ordered most to least expensive
      //
      // Sorting would be costly in large amounts
      if (e.detail.length === undefined) return;
      let card = e.detail[0];

      this._mostExpensive = card.Name;

      let friendly = cardToImageName(card.Name);
      this.$.art.imgSrc = urlBuilders.ImageURL(friendly, this.name);

      // Set the price of the displayed card
      this.$.price.setPrice(card.Price);
    }

  });
})();