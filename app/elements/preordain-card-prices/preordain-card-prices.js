(function () {
  Polymer({
    // A view of all price data relevant for a specific card.
    is: 'preordain-card-prices',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      _selected: { // Which set are dealing with
        type: String,
        value: ' ',
      },
      _printings: {
        type: Array,
        value: ()=> [],
      }
    },
    attached: function(){
      console.log('aha');
    },
    newData: function({detail:{Printings}}) {
      // Grab all the valid printings for this card.
      this._printings = Printings.filter((p)=> setList.has(p));
      this._selected = this._printings[0];
      console.log(this._printings);
    },


  });
})();