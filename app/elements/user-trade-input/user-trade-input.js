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

      /* Example trade submission
      https://beta.perfectlag.me/api/Users/everlag/Collections/Inventory/Trades

      {
        "sessionKey":"validSession",
        "trade":
        [
          {"Name":"Evolving Wilds",
          "Set":"Duel Decks: Ajani vs. Nicol Bolas",
          "Quantity":1,
          "Comment":"more sanity",
          "LastUpdate":"2015-08-16T06:10:09.974Z",
          "Quality":"NM",
          "Lang":"EN"}
        ]
      }

      */ 

      // Some conversions that need to be done.

      // The backend only accepts ISO formatted strings
      // while providing  other times... what a hypocrite! :)
      let ISOTime = new Date(this.time).toISOString();
      // Convert to the offical set name the server recognizes
      let officialSet = displayToOfficialSets[this._workingSet];
      // Don't send a string instead of a number...
      let quantity = Number.parseInt(this._workingQuantity);

      // Submits the current details to the 
      // trade with the      
      let card = {
        // The card's chosen facets
        'Name': this._workingCard,
        'Set': officialSet,
        'Quantity': quantity,
        // Constant facets of the updated trade
        'Comment': this.comment,
        'LastUpdate': ISOTime,
        // Hardcoded for now
        'Quality': 'NM',
        'Lang': 'EN',
      };
      let payload = JSON.stringify({
        'sessionKey': mutable.session,
        'trade': [card],
      });
      let method = 'POST';
      let url = buildAddItemURL(mutable.name, userDefaults.collection);
      ajaxJSON(method, url, payload,
        (result)=> this._success(),
        (result)=> this._failure());
    },
    _success: function(){
      console.log('added!');
    },
    _failure: function(){
      console.log('failed!');
    },
    // Announce we're done adding cards
    _done: function() {
      this.fire('done');
    }

  });
})();