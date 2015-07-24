(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'preordain-source-selector',
    properties: {
      // State
      source: {
        type: String,
        value: sources.default,
        notify: true,
        observer: '_sourceChanged',
      },
    },
    _sourceChanged: function() {
      // Reflect to the global state that we're using
      // this source now.
      mutable.priceSource = this.source;

      this.fire('iron-signal', {name: 'source-change', data: null});
    }

  });
})();