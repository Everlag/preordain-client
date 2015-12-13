(function () {
  Polymer({
    // A full list of supported sets
    is: 'preordain-set-gallery-item',
    behaviors: [ViewNotifyBehavior],
    properties: {
      name: {
        type: String,
        value: ' ',
        observer: '_nameChanged',
      },
      imageLoc: {
        type: String,
        value: ' ',
      },
      price: {
        type: Number,
        value: 0
      }
    },
    _nameChanged: function() {
      // New name, start checking if we're visible!
      this._ViewNotifyStartCheck();
    },
    // We only receive a single viewNotify call after starting
    // the checking.
    _viewNotify: function() {
      this.fire('is-visible');
      
      // Stop checking!
      return true;
    }

  });
})();