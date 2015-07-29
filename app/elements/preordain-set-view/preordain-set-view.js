(function () {
  Polymer({
    // A full set's worth of information.
    //
    // Dispatches the 'request-card' event when a user inquires
    // about more detail for a specific card.
    is: 'preordain-set-view',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
    },
    attached: function() {
    },
    _facetChanged: function(){
      // Ensure we are dealing only with valid set names
      if (!displaySets.has(this.name)) throw 'invalid set name';
    },

  });
})();