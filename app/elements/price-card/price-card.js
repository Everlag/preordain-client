(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'price-card',
    properties: {
      // Filters
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      set: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      closest: {
        type: Number,
        value: 0,
        notify: true,
        observer: '_facetChanged',
      },
      // An override, otherwise it fetches the global value
      source: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      // The mode this price fetcher runs in
      latestHighest: { // Highest priced printing
        type: Boolean,
        value: false,
      },
      latestLowest: { // Lowest priced printing
        type: Boolean,
        value: false,
      },
      latestSpecific: { // Latest printing for a set
        type: Boolean,
        value: false,
      },
      weeksMedian: { // Historical prices by week
        type: Boolean,
        value: false,
      },
      closestMatch: { // Price closest to provided timestamp
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
      let sum = this.latestHighest + this.latestLowest + 
      this.weeksMedian + this.latestSpecific + this.closestMatch;
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

      // Avoid sending invalid requests for endpoints that
      // require sets.
      if ((this.latestSpecific || this.closestMatch || this.weeksMedian) &&
        (this.set.trim().length === 0)) return;

      // Fetch the price source from the global, mutable scope.
      let source = mutable.priceSource;
      // Check to see if the global has been overrideen
      if (this.source.trim()) source = this.source;

      let officialSetName = '';
      if (this.set.trim().length > 0) {
        officialSetName = displayToOfficialSets[this.set];
      }

      if (this.latestHighest) {
        this._url = urlBuilders.LatestHighestURL(this.name, source);
      }
      if (this.latestLowest) {
        this._url = urlBuilders.LatestLowestURL(this.name, source);
      }
      if (this.latestSpecific) {
        this._url = urlBuilders.LatestSpecificURL(this.name, officialSetName, source);
      }
      if (this.weeksMedian) {
        this._url = urlBuilders.WeeksMedianURL(this.name, officialSetName, source);
      }
      if (this.closestMatch) {
        this._url = urlBuilders.ClosestURL(this.name, officialSetName,
          this.closest, source);
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