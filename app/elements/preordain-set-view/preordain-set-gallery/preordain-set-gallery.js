(function () {

  // Sets to add to display on a mobile
  // where everything is vertical
  let smallBatch = 5;
  // Sets to display on a desktop with a lot
  // of horizontal room 
  let bigBatch = 20;
  let batchSize = 10;

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
      _big: {
        type: Boolean,
        value: false,
        observer: '_batchChanged',
      },
      _dirtyCheck: {
        type: Boolean,
        value: true,
      },
      _batchSize: {
        type: Number,
        value: smallBatch,
      },
    },
    attached: function(){
      // Set the inital timeout to check for
      // being at the bottom 
      this.async(this._inView, 300);
    },
    _inView: function(){

      // Load up the next callback
      this.async(this._inView, 300);

      // Not active? Don't bother!
      if (!this.active) return;

      if (this.$.bottomStopper.hidden && this._prices.length === 0) {
        return;
      }

      // Check if we can see the topmost reference element
      let refViewed = $(this.$.topSignage).isOnScreen();
      // Check if we can see the bottom element we append by
      let atBottom = $(this.$.bottomStopper).isOnScreen(0.1, 0.1);

      // If we can see the bottom but not the top, then
      // we have reached the bottom.
      //
      // When on another view, such as /card/:name,
      // both are true, we want to avoid saying we reached
      // the bottom in that sitatuon!
      if (atBottom &&
          (!refViewed || this._dirtyCheck)) this._bottomReached();

      // If we can see the bottom and not the top ever,
      // then we can stop using the dirty check.
      if (atBottom && !refViewed) this._dirtyCheck = false;

      // Check if we're out of cards for now
      if (this._prices.length === 0) {
        // Hide the loading indicator
        this.$.bottomStopper.hidden = true;
      }else{
        // Show the indicator
        this.$.bottomStopper.hidden = false;
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

      // Set the inital batch size level
      this._batchChanged();

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
    _batchChanged: function() {
      if (this._big) {
        this._batchSize = bigBatch;
      }else{
        this._batchSize = smallBatch;
      }
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