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
    },
    // The currently viewed trade is done
    _tradeDone: function() {
      // Set the user-trades to not display any trade as
      // selected
      this.$.history.Selected = 0;
      this._selected = false;
    },
    _addTrade: function(){

    },
    _refreshTrades: function(){
      // Refresh the current trade history.
      this.$.history.refresh();
    }

  });
})();