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
      _tinyImgSrc: { // The source they want to show
        type: String,
        value: ' ',
        notify: true,
        observer: '_newSrc',
      },
      _storedSource: { // The source they want to show
        type: String,
        value: ' ',
        notify: true,
      },
      _placeHolder: {
        type: String,
        value: initialImage,
      },
      _showTiny: {
        type: Boolean,
        value: false,
      },
      _anyLoaded: {
        type: Boolean,
        value: false,
      },
      _loaded: {
        type: Boolean,
        value: false,
      },
    },
    attached: function(){
      // Add a manual listener
      this.$.img.addEventListener('load',()=> this._hasLoaded());
      this.$.tiny.addEventListener('load',()=> this._tinyLoaded());
      
      this.async(this._inView, 100);
    },
    _inView: function(){

      // Set up the next view
      //
      // It's important to always check,
      // the src could've changed!
      this.async(this._inView, 100);

      // Early exit if we've already loaded everything
      // or we're not actually in the view of the user.
      if (this._loaded || !$(this).isOnScreen(0.1, 0.1)) return;

      // If we've loaded the tiny, attempt to pull the full
      if (this._anyLoaded) this._pullFull();
    },
    _hasLoaded: function(){
      // Remove the placeholder.
      this._loaded = true;
      this._anyLoaded = true;
      this._showTiny = false;
    },
    _tinyLoaded: function(){
      // Remove the placeholder.
      this._anyLoaded = true;
      
      // Show the thumbnail only if we don't already have the full
      if (!this._loaded) this._showTiny = true;
    },
    _pullFull: function(){
      // Start loading the full source if the stored source
      // hasn't gone stale already
      //
      // Staleness is checked by inverting the transform performed to
      // acquire _tinyImgSrc and ensuring its still what we're looking for.
      //
      // By avoiding the immediate load of the full image, other
      // mtg-card-art elements can have a chance to load their thumbnails.
      let origSource = this._tinyImgSrc.replace(remote.cardImageTiny,
        remote.cardImage);
      if (origSource === this.imgSrc) this._storedSource = this.imgSrc;
    },
    _newSrc: function () {
      // Add a placeholder
      this._loaded = false;
      this._anyLoaded = false;
      this._showTiny = false;

      // Translate the full src into a tiny src
      this._tinyImgSrc = this.imgSrc
        .replace(remote.cardImage, remote.cardImageTiny);
    },

  });
})();