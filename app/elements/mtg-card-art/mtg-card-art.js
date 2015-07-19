(function () {
  Polymer({
    // A single piece of magic art. Grows and shrinks as the parent allows
    // while maintaining aspect ratio.
    //
    // While loading, or failure of, the image it shows a placeholder. This
    // prevents layout from being 'jostled'.
    is: 'mtg-card-art',
    properties: {
      imgSrc: { // The source they want to show
        type: String,
        value: ' ',
        notify: true,
        observer: '_newSrc',
      },
      _placeHolder: {
        type: String,
        value: initialImage,
      },
      _loaded: {
        type: Boolean,
        value: false,
      },
    },
    attached: function(){
      // Add a manual listener
      this.$.img.addEventListener('load',()=> this._hasLoaded());
    },
    _hasLoaded: function(){
      // Remove the placeholder.
      this._loaded = true;
    },
    _newSrc: function () {
      // Add a placeholder
      this._loaded = false;
    },

  });
})();