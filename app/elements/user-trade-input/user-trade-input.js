(function () {
  Polymer({
    is: 'user-trade-input',
    properties: {
      // The choices the user has made in this trade
      comment: {
        type: String,
        value: ' ',
      },
      time: {
        type: String,
        value: 0,
      },
      _workingCard: {
        type: String,
        value: ' ',
      },
      _workingSet: {
        type: String,
        value: ' ',
      },
      _workingQuantity: {
        type: String,
        value: 0,
      },
      _cardSelected: {
        type: Boolean,
        value: false,
        computed: '_isValidSelection(_workingCard)',
      },
      _setSelected: {
        type: Boolean,
        value: false,
        computed: '_isValidSelection(_workingSet)',
      },
      _quantitySelected: {
        type: Boolean,
        value: false,
        computed: '_isValidQuantity(_workingQuantity)',
      }
    },
    _seedChanged: function(){

    },
    _cardChosen: function({detail: {choice} }) {
      this._workingCard = choice;
    },
    _isValidSelection: function(card) {
      if (card.trim().length > 0) return true;
      return false;
    },
    _isValidQuantity: function(quantity) {
      return Math.abs(quantity) > 0;
    },
    _submit: function() {
      // Submits the current details to the 
      // trade with the
      let card = {
        // The card's chosen facets
        'Name': this._workingCard,
        'Set': this._workingSet,
        'Quantity': this._workingQuantity,
        // Constant facets of the updated trade
        'Comment': this.comment,
        'LastUpdate': this.time,
        // Hardcoded for now
        'Quality': 'NM',
        'Lang': 'EN',
      };
      let payload = {
        'sessionKey': mutable.sessionKey,
        'trade': [card],
      };
      let method = 'POST';
      let url = buildAddItemURL(mutable.name, userDefaults.collection);
      ajaxJSON(method, url, payload,
        (result)=> this._success,
        (result)=> this._failure);
    },
    _success: function(){

    },
    _failure: function(){
      
    }
    // Announce we're done adding cards
    _done: function() {
      this.fire('done');
    }

  });
})();