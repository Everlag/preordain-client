(function () {
  Polymer({
    is: 'preordain-trade-view',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_nameChanged',
      },
      // If we are running under a public context
      //
      // The name observer sets this.
      _public: {
        type: Boolean,
        value: true,
        notify: true,
      },
      _big: {
        type: Boolean,
        value: false,
      },
      _selected: { // If a trade is selected
        type: Boolean,
        value: false,
      },
      _selectedTimeInt: { // The currently selected time integer
        type: Number,
        value: 0,
        notify: true
      },
      _selectedComment: {
        type: String,
        value: ' ',
        notify: true,
      },
      _selectedTime: {
        type: String,
        value: 0,
        notify: true,
      }
    },
    _nameChanged: function(){
      this._public =
        !(this.name === mutable.name &&
        mutable.session.length > 0);
    },
    // A trade has been selected, we show the input
    // and assign the comment and time that the trade has
    _tradeSelected: function({detail}) {
      let first = detail[0];
      this._selectedTime = first.LastUpdate;
      this._selectedComment = first.Comment;
      this._selected = true;

      // Clear any potential newTrade state
      this.$.tradeInput.newTrade = false;
    },
    // The currently viewed trade is done
    _tradeDone: function() {
      // Set the user-trades to not display any trade as
      // selected
      this._selectedTimeInt = 0;
      this._selected = false;
    },
    _addTrade: function(){
      // A new trade means we select a new time
      //
      // Any time which can be unserialized into a correct
      // Date object is correct for us
      let now = new Date();
      this._selectedTime = now.toJSON();
      this._selectedComment = '';
      this._selectedTimeInt = Truncate(now / 1000, 0);
      this.$.tradeInput.newTrade = true;
      this._selected = true;
    },
    _refreshTrades: function(){
      // Refresh the current trade history.
      this.$.history.refresh();
    }

  });
})();