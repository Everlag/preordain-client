(function () {

  // Sets to add to display on a mobile
  // where everything is vertical
  let smallBatch = 20;
  // Sets to display on a desktop with a lot
  // of horizontal room 
  let bigBatch = 30;
  let batchSize = 20;

  Polymer({
    // A full list of supported sets
    is: 'preordain-set-list',
    properties: {
      active: {
        type: Boolean,
        value: false,
      },
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
      _dirtyCheck: {
        type: Boolean,
        value: true,
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
      // Duel decks are also undesirable due to lack of
      // signficiant value.
      //
      // Also sort by descending timestamp
      this._sets = setArray
        .filter((s)=> !s.includes('Foil'))
        .filter((s)=> !s.includes('Duel Decks'))
        .filter((s)=> !isNaN(displaySetReleases[s]))
        .sort((a, b)=> displaySetReleases[a] - displaySetReleases[b])
        .reverse();

      // Populate the inital batch
      this._bottomReached();
    },
    _inView: function(){

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
      //
      // When transitioning, things get funky so we check
      // only if we're the active element.
      if (atBottom && this.active &&
          (!refViewed || this._dirtyCheck)) this._bottomReached();

      // If we can see the bottom and not the top ever,
      // then we can stop using the dirty check.
      if (atBottom && !refViewed && !this.active) this._dirtyCheck = false;

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