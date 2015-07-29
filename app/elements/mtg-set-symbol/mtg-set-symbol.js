(function () {
  Polymer({
    is: 'mtg-set-symbol',
    properties: {
      set: {
        type: String,
        value: ' ',
        notify: true,
      },
      _symbolURL: {
        type: String,
        value: ' ',
        computed: '_getSetSymbol(set)',
      },
    },
    _getSetSymbol: function(name){
      return buildSetSymbolURL(name);
    },

  });
})();