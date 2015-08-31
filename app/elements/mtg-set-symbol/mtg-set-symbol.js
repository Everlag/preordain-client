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
      _foil: {
        type: String,
        value: ' ',
        computed: '_isFoil(set)',
      }
    },
    _getSetSymbol: function(name){
      // Ignore invalid names!
      if (name === undefined || name.trim().length === 0) return;
      return urlBuilders.SetSymbolURL(name);
    },
    _isFoil: function(name) {
      return name.indexOf('Foil') !== -1;
    }

  });
})();