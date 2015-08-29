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
      _mobileSelected: {
        type: Boolean,
        value: false,
      },
      _fixedSelected: {
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
      },
      _pulsate: {
        // Whether or not to pulsate the add button
        type: Boolean,
        value: false
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
      this._showTradeInput(false);
    },
    // The currently viewed trade is done
    _tradeDone: function() {
      // Set the user-trades to not display any trade as
      // selected
      this._selectedTimeInt = 0;
      this._fixedSelected = false;
      this._mobileSelected = false;

      // Clear any existing comment.
      this._selectedComment = '';

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
      this._showTradeInput(true);

      // Stop pulsating!
      this._pulsate = false;
    },
    _showTradeInput: function(newTrade = false){
      let input;

      // Show the correct input based on screen size
      if (this._big) {
        input = this.$.tradeInputFixed;
        this._mobileSelected = false;
        this._fixedSelected = true;
      }else{
        input = this.$.tradeInputMobile;
        this._fixedSelected = false;
        this._mobileSelected = true;
      }

      // A new trade or not
      input.newTrade = newTrade;     
    },
    _refreshTrades: function(){
      // Refresh the current trade history.
      this.$.history.refresh();
    },
    _newUser: function() {
      // Point the user to a new
      // trade by pulsating the add button
      this._pulsate = true;
    }

  });
})();