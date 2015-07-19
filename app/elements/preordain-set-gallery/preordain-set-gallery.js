(function () {
  Polymer({
    // A full set's gallery of cards with prices.
    //
    // Dispatches the 'request-card' event when a user inquires
    // about more detail for a specific card.
    is: 'preordain-set-gallery',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      _prices: {
        type: Array,
        value: ()=> [],
      },
      _pricesReady: {
        type: Boolean,
        value: false,
        computed: '_arePricesReady(_prices)',
      },
      _galleryReady: {
        type: Boolean,
        value: false,
      }
    },
    attached: function() {
      // We deal with gallery hiding until
      // until a sufficient number of the images
      // have been downloaded for layout to occur.
      this.imagesToLoad = 0;
      this.imagesLoaded = 0;
    },
    pricesDown: function(e){
      let prices = e.detail;
      // Clean out the cruft we don't want
      prices = prices.filter((a)=> a.Price >= 100);

      // Sort the results by decreasing price.
      prices.sort((a, b)=> a.Price - b.Price).reverse();

      // Add some metadata to to each.
      prices.forEach(function(a){
        a.ImageLoc = buildImageURL(cardToImageName(a.Name));
        a.Price = a.Price / 100;
      });
      
      this.imagesToLoad = (3 * prices.length) / 4;
      this.imagesLoaded = 0;

      this._prices = prices;
    },
    _arePricesReady: function(prices){
      if (prices !== null && prices.length > 0) return true;

      return false;
    },
    _facetChanged: function(){
      // Ensure we are dealing only with valid set names
      if (!setList.has(this.name)) throw 'invalid set name';
    },
    _imageLoaded: function(){
      this.imagesLoaded++;
      if (this.imagesLoaded >= this.imagesToLoad){
        this._galleryReady = true;
      };
    },
    requestCard: function(e){
      let data = {
        Name: e.model.item.Name,
        Set: this.name,
      }

      this.fire('request-card', data);
    }

  });
})();