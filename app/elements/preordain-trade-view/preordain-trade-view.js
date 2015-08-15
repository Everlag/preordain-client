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
      _big: {
        type: Boolean,
        value: false,
      },
      _selected: { // If a trade is selected
        type: Boolean,
        value: false,
      }
    },
    _nameChanged: function(){
      
    },
    // A trade has been selected, we show the input
    _tradeSelected: function({detail}) {
      this._selected = true;
    },
    // The currently viewed trade is done
    _tradeDone: function() {
      // Set the user-trades to not display any trade as
      // selected
      this.$.history.Selected = 0;
      this._selected = false;
    }

  });
})();