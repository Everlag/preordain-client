(function () {

  // Sets to add to display on a mobile
  // where everything is vertical
  let smallBatch = 7;
  // Sets to display on a desktop with a lot
  // of horizontal room 
  let bigBatch = 30;

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

      // Set the batch size based on display size
      if (this._big) this._batchSize = bigBatch;

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

      // Call for the next batch of sets,
      // it doesn't matter if we're out
      this._bottomReached();

      // Check if we're out of sets
      if (this._sets.length === 0) {
        // Hide the bottom stopper if we are
        this.$.bottomStopper.hidden = true;
      }
    },
    _summaryVisible: function(e) {
      
      // Check to see where this set sits
      let set = e.target.name;
      let pos = this._displaySets.indexOf(set);
      let remaining = this._displaySets.length - pos;

      // Determine threshold for next batch based on display size
      let threshold = this._batchSize / 2;
      if (this._batchSize === bigBatch) {
        threshold = this._batchSize / 4;
      }

      if (remaining < threshold){
        this._inView();
      }
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
    }

  });
})();