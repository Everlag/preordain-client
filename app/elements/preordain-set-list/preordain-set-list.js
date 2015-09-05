(function () {

  // Whether or not an element is in view
  //
  // Finicky but works, courtesy of:
  //  http://stackoverflow.com/a/22480938
  function inView(element) {
    let elementTop    = element.getBoundingClientRect().top;
    let elementBottom = element.getBoundingClientRect().bottom;

    return elementTop >= 0 && elementBottom <= window.innerHeight;
  }

  // Sets to add to display on a mobile
  // where everything is vertical
  let smallBatch = 5;
  // Sets to display on a desktop with a lot
  // of horizontal room 
  let bigBatch = 20;
  let batchSize = 10;

  Polymer({
    // A full list of supported sets
    is: 'preordain-set-list',
    properties: {
      _displaySets: {
        type: Array,
        value: ()=> [],
      },
      _sets: {
        type: Array,
        value: ()=> [],
      },
      _big: {
        type: Boolean,
        value: false,
        observer: '_batchChanged',
      },
      _batchSize: {
        type: Number,
        value: smallBatch,
      },
    },
    attached: function() {
      // We store it as a set, we need it as an array
      let setArray = [];
      for (let s of displaySets){
        setArray.push(s);
      }

      // Set the inital timeout to check for
      // being at the bottom 
      this.async(this._inView, 300);

      // Set the inital batch size level
      this._batchChanged();

      // We don't want to deal with the foil counterpart!
      //
      // Also sort by descending timestamp
      this._sets = setArray
        .filter((s)=> !s.includes('Foil'))
        .sort((a, b)=> displaySetReleases[a] - displaySetReleases[b])
        .reverse();

      // Populate the inital batch
      this._bottomReached();
    },
    _inView: function(){

      // Check if we can see the topmost reference element
      let refViewed = inView(this.$.topSignage);
      // Check if we can see the bottom element we append by
      let atBottom = inView(this.$.bottomStopper);

      // If we can see the bottom but not the top, then
      // we have reached the bottom.
      //
      // When on another view, such as /card/:name,
      // both are true, we want to avoid saying we reached
      // the bottom in that sitatuon!
      if (atBottom && !refViewed) this._bottomReached();

      // Check if we're out of sets
      if (this._sets.length === 0) {
        // Hide the bottom stopper
        this.$.bottomStopper.hidden = true;
        // Stop checking to see if we're at the bottom!
        return;
      }
      this.async(this._inView, 300);
    },
    requestSet: function(e){
      let data = {
        Name: e.model.item,
      };

      this.fire('request-set', data);
    },
    _bottomReached: function(){
      // Pop off the next batch to add to the display sets
      let additions = this._sets.splice(0, this._batchSize);

      // Add the elements in an observable manner
      additions.forEach((item)=> this.push('_displaySets', item));
    },
    _batchChanged: function() {
      if (this._big) {
        this._batchSize = bigBatch;
      }else{
        this._batchSize = smallBatch;
      }
    }

  });
})();