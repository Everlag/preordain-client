(function () {
  Polymer({
    is: 'user-trades',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_nameChanged',
      },
      selected: { // The TimeInt of the selected trade, if any
        type: Number,
        value: 0,
        notify: true,
      },
      isPublic: { // Whether or not this is a public collection
        type: Boolean,
        value: false,
      },
      _decorated: { // The trades intersped with set releases
        type: Array,
        value: ()=> [], 
      },
      _status: { // Loading status of trades
        type: String,
        value: 'done',
      },
      _newUser: {
        type: Boolean,
        value: false,
      }
    },
    attached: function(){
      this._nameChanged();
    },
    _nameChanged: function(){

      if (!this.name || this.isPublic === undefined) {
        return;
      }
      let effectiveName = this.name;
      let payload = null;
      let method = 'GET';

      if (!this.isPublic){
        effectiveName = mutable.name;
        payload = JSON.stringify({'sessionKey': mutable.session});
        method = 'POST';
      }

      let url = urlBuilders.TradesURL(effectiveName,
        userDefaults.collection, this.isPublic);

      ajaxJSON(method, url, payload,
        (result)=> this._success(result),
        (result)=> this._failure());

      // Set the spinner to spin
      this._status = 'loading';

    },
    _success: function(result) {
      let Historical = [];
      try{
        // [ignore] jshint seems to get unhappy with a
        // destructuring assignment that uses existing variables.
        /* jshint ignore:start */
        ({Historical} = JSON.parse(result));
        /* jshint ignore:end */
      }catch(e){
        this._failure();
      }

      // Special case of a brand new user
      // they have no history but make them feel welcome!
      if (Historical === null) {
        this._newUser = true;
        this._status = 'done';

        // Let the parent know about this!
        this.fire('new-user');
        return;
      }

      // Compute individual trades from the bulk history then 
      // add metadata that assists with layout and UX
      let trades = addTradesUX(buildTrades(Historical));
      
      this._decorated = decorateTrades(trades);

      // Kill the spinner
      this._status = 'done';
    },
    _failure: function(){
      // Display an error message
      this._status = 'error';
    },
    _isSelected: function(TimeInt) {
      if (this.selected === TimeInt) return true;
      return false;
    },
    _selectTrade: function(e) {
      // We know at least on element in the event path has the
      // data-timeint attribute so we look in the path
      // until we find it.
      let TimeInt = 0;
      for (var i = 0; i < e.path.length; i++) {
        let t = e.path[i].dataset.timeint;
        if (!t) continue;
        TimeInt = t;
        break;
      }

      // Ignore the event if we didn't find a valid time
      // to select
      if (!TimeInt) return;

      // Set the selected so we can label the trade as such
      this.selected = Number.parseInt(TimeInt);

      // Fire an event with the trade as the details
      let trade = this._decorated.filter((t)=>{
        return t.TimeInt === this.selected;
      })[0];

      this.fire('selected', trade);
    },
    refresh: function(){
      // Asking for the data to be reacquired with
      // any potential updates and redrawn
      this._nameChanged();
    }

  });
})();