(function () {
  Polymer({
    // A wrapper for raw access to preorda.in pricing.
    //
    // Events are fired when we are successful
    is: 'mtg-card-price',
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
      // Price source options
      mkmSource: {
        type: Boolean,
        value: false,
      },
      _url:{
        type: String,
        value: ' ',
      }
    },
    attached: function(){

      console.log("AHAHAHAHA");
      this.ajax = this.$.ajax;

      // Ensure we run in only a single mode or else things break...
      if (!this._validChoice()) {
        throw 'Mode needs a single choice'
      };

      this._facetChanged();
    },
    _validChoice: function(){
      let sum = this.latestHighest + this.latestLowest + 
      this.weeksMedian + this.latestSpecific + this.closestMatch;
      if (sum !== 1) {
        return false;
      };

      return true;
    },
    _facetChanged: function(){
      // Make sure we're initialzed
      if (!this._validChoice() || this.name.trim().length !== 0) {
        return;
      };

      // Deal with alternative sources
      let source = sources.mtgprice;
      if (this.mkmSource) {
        source = sources.mkm;
      };

      if (this.latestHighest) {
        this._url = buildLatestHighestURL(this.name, source);
      };
      if (this.latestLowest) {
        this._url = buildLatestLowestURL(this.name, source);
      };
      if (this.latestSpecific) {
        this._url = buildLatestSpecificURL(this.name, this.set, source);
      };
      if (this.weeksMedian) {
        this._url = buildWeeksMedianURL(this.name, this.set, source);
      };
      if (this.closestMatch) {
        this._url = buildClosestURL(this.name, this.set,
          this.closest, source);
      };

    },
    hresponse: function(e){
      console.log(this);
      this.fire('price', this.ajax.lastResponse)
    },


  });
})();