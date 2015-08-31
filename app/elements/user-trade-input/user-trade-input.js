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
        observer: '_timeChanged',
      },
      newTrade: { // If this is a new trade.
        type: Boolean,
        value: false,
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
      _showTypeahead: {
        type: Boolean,
        value: true,
        computed: '_doShowTypeahead(newTrade, comment)'
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
      },
      _status: { // Loading status of trades
        type: String,
        value: 'done',
      },
    },
    ready: function() {
      this.input = {
        comment: this.$.comment,
        typeahead: this.$.cardInput,
        quantity: this.$.quantity,
        submitter: this.$.submitter,
      };
    },
    // Selects the first valid input for the element
    selectFirstInput: function() {
      if (this.newTrade) {
        // Select the comment
        this._selectCommentInput();
      }else{
        // Select the card typeahead
        this._selectTypeahead();
      }
    },
    _timeChanged: function(){
      // If the time changes, then our
      // internal states gets reset
      this._clearInternalState();
    },
    _doShowTypeahead: function(newTrade, comment){
      // Show the typeahead on new trades only
      // if a comment has been made
      if (newTrade) {
        if (comment.trim().length > 0) {
          return true;
        }else{
          return false;
        }
      }

      // If not a new trade then we always want to show the typeahead
      return true;
    },
    _cardChosen: function({detail: {choice} }) {
      // Set our internal state
      this._workingCard = choice;

      // Select the quantity input
      this._selectQuantityInput();
    },
    _isValidSelection: function(card) {
      if (card.trim().length > 0) return true;
      return false;
    },
    _isValidQuantity: function(quantity) {
      return Math.abs(quantity) > 0;
    },
    _submit: function() {

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

      remoteComms.addCard(mutable.name, mutable.session, card,
        (result)=> this._success(),
        (result)=> this._failure());

      // Remove this from being a newTrade
      if (this.newTrade) this.newTrade = false;

      this._clearInternalState();

      // Show the spinner
      this._status = 'loading';
    },
    _success: function(){
      console.log('added!');
      this.fire('card-added');

      // Select the first valid field
      // so no clicking or tapping is required!
      this.selectFirstInput();

      // Hide the spinner
      this._status = 'done';
    },
    _failure: function(){
      // Show an error
      this._status = 'error';
    },
    // Announce we're done adding cards
    _done: function() {
      this.fire('done');
    },
    // Clears out the internal state so
    // progressive disclosure functions correctly
    _clearInternalState: function(){
      this._workingCard = ' ';
      this._workingSet = ' ';
      this._workingQuantity = 0;
      this._clearTypeahead();
    },
    // Cleanly clears the typeahead
    _clearTypeahead: function(){
      // Clear the value
      this.$.cardInput.setValue('');
    },
    _selectTypeahead: function() {
      this.input.typeahead.selectInput();
    },
    _selectCommentInput: function() {
      this.input.comment.inputElement.select();
    },
    _selectQuantityInput: function() {
      this.input.quantity.inputElement.select();
    },


  });
})();