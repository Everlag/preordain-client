(function () {

  Polymer({
    // A single line on a template.
    //
    // A separate element as that makes life saner vs string templating
    // and the sanitation polymer provides is very convenient.
    //
    // Typical usage is manual DOM manipulation as bindings typically aren't
    // called until it is attached.
    is: 'misc-typeahead-line',
    properties: {
      // Data
      suggestion: {
        type: String,
        value: ' ',
        notify: true,
      },
      // Display options
      _set: {
        type: Boolean,
        value: false,
      },
      showPrices: { // Optional flag
        type: Boolean,
        value: false,
      },
      _showPrices: { // Internal state
        type: Boolean,
        value: true,
        computed: '_doShowPrices(_set, showPrices)',
      }
    },
    attached: function(){

      this._set = displaySets.has(this.suggestion);

    },
    _doShowPrices: function(isSet, showPrices){
      return !isSet && showPrices;
    }


  });
})();