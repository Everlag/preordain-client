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
      active: {
        type: Boolean,
        value: false,
      },
      _displayPrices: {
        type: Array,
        value: ()=> [],
      },
      _prices: {
        type: Array,
        value: ()=> [],
      },
      _dirtyCheck: {
        type: Boolean,
        value: true,
      },
      _batchSize: {
        type: Number,
        value: 10,
      },
    },
    _inView: function(){

      // Call for the next batch of cards
      this._bottomReached();

      // Check if we're out of cards for now
      if (this._prices.length === 0) {
        // Hide the loading indicator
        this.$.bottomStopper.hidden = true;
      }else{
        // Show the indicator
        this.$.bottomStopper.hidden = false;
      }

    },
    _cardVisible: function(e){
      // Check to see where this card sits
      let card = e.target.name;
      let pos = this._displayPrices.findIndex((p)=> card === p.Name);
      let remaining = this._displayPrices.length - pos;

      // Determine threshold for next batch
      let threshold = this._batchSize / 2;

      if (remaining < threshold){
        this._inView();
      }
    },
    pricesDown: function(e){
      let prices = e.detail;
      // Clean out the cruft we don't want
      prices = prices.filter((a)=> a.Price >= 100);

      // Sort the results by decreasing price.
      prices.sort((a, b)=> a.Price - b.Price).reverse();

      // Add some metadata to to each.
      prices.forEach((a)=>{
        a.ImageLoc = urlBuilders.ImageURL(cardToImageName(a.Name), this.name);
        a.Price = a.Price / 100;
      });

      this._prices = prices;

      // Populate the inital batch
      this._bottomReached();
    },
    _facetChanged: function(){
      // Ensure we are dealing only with valid set names
      if (!displaySets.has(this.name)) throw 'invalid set name';

      // The prices aren't good to go yet
      this._prices = [];
      this._displayPrices = [];
    },
    _bottomReached: function(){
      // Pop off the next batch to add to the display sets
      let additions = this._prices.splice(0, this._batchSize);

      // Add the elements in an observable manner
      additions.forEach((item)=> this.push('_displayPrices', item));
    },
    requestCard: function(e){
      let data = {
        Name: e.model.item.Name,
        Set: this.name,
      };

      this.fire('request-card', data);
    }

  });
})();