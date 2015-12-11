(function () {
  Polymer({
    // A full list of supported sets
    is: 'preordain-set-summary',
    behaviors: [ViewNotifyBehavior],
    properties: {
      name: {
        type: String,
        value: ' ',
      },
      _mostExpensive: {
        type: String,
        value: ' ',
      },
      // Whether or not to fire an event when
      // we are visible.
      _doNotify: {
        type: Boolean,
        value: true,
      }
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
    },
    // Callback for ViewNotifyBehavior to let us know
    // we're sufficiently visible to the user.
    //
    // Only notify once, this is an expensive operation.
    _viewNotify: function(){
      // Let the parent element know
      if (this._doNotify) this.fire('is-visible');
      this._doNotify = false;

      // Stop further visibility checking.
      return true;
    },

  });
})();