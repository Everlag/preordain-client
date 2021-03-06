(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'price-set',
    properties: {
      // Filters
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      // The mode this price fetcher runs in
      expectedValue: { // Expected value of a box opened
        type: Boolean,
        value: false,
      },
      completeLatest: { // Complete price list for the set
        type: Boolean,
        value: false,
      },
      _url:{
        type: String,
        value: ' ',
      }
    },
    attached: function(){
      // Ensure we run in only a single mode or else things break...
      if (!this._validChoice()) {
        throw 'Mode needs a single choice';
      }

      this._facetChanged();
    },
    _validChoice: function(){
      let sum = this.completeLatest + this.expectedValue;
      if (sum !== 1) {
        return false;
      }

      return true;
    },
    _facetChanged: function(){

      // Make sure we're initialzed
      if (!this._validChoice() || this.name.trim().length === 0) {
        return;
      }

      // Fetch the price source from the global, mutable scope.
      let source = mutable.priceSource;

      // Convert to the official name that the remote uses.
      let officialName = displayToOfficialSets[this.name];

      if (this.expectedValue) {
        this._url = urlBuilders.ExpectedValueURL(officialName, source);
      }
      if (this.completeLatest) {
        this._url = urlBuilders.CompleteLatestURL(officialName, source);
      }

      if (this._url.length > 0) this.$.ajax.generateRequest();

      // Send out a notice that we're holding onto a stale price
      this.fire('stale-price', true);

    },
    hresponse: function(e){
      this.fire('price', this.$.ajax.lastResponse);
    },


  });
})();