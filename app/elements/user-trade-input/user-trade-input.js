(function () {
  Polymer({
    is: 'user-trade-input',
    properties: {
      // The items in the trade already present
      seed: {
        type: Array,
        value: ()=> [],
        notify: true,
        observer: '_seedChanged',
      },
      // The choices the user has made in this trade
      changes: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      _workingCard: {
        type: String,
        value: ' ',
      }
    },
    _seedChanged: function(){

    },
    _cardChosen: function({detail: {choice} }) {
      this._workingCard = choice;
    }

  });
})();