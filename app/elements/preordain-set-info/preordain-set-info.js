(function () {

  function contains (total, sub) {
    if (total.indexOf(sub) !== -1) return true;
    return false
  }

  // A list of substrings we don't show EV for when
  // it is triggered
  let noEVSets = ['Foil', 'Promo'];

  // Returns division cleanly truncated at 2 decimal places.
  function roundPercent (dividend, divider) {
    let result = (dividend / divider) * 100;
    return Math.round(result * 100) / 100;
  }

  Polymer({
    // A full set's worth of information.
    //
    // Dispatches the 'request-card' event when a user inquires
    // about more detail for a specific card.
    is: 'preordain-set-info',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_facetChanged',
      },
      ev: {
        type: Number,
        value: NaN,
      },
      _symbolURL: {
        type: String,
        value: ' ',
        computed: '_getSetSymbol(name)',
      },
      _showEV: {
        type: Boolean,
        value: true,
        computed: '_validEV(name, _validContribs)',
      },
      // Contributions to total EV
      cContribution: {
        type: Number,
        value: NaN,
      },
      uContribution: {
        type: Number,
        value: NaN,
      },
      rContribution: {
        type: Number,
        value: NaN,
      },
      mContribution: {
        type: Number,
        value: NaN,
      },
      _validContribs: {
        type: Boolean,
        value: true,
        computed: '_isValidContribs(cContribution, uContribution, rContribution, mContribution)',
      }
    },
    attached: function() {
    },
    _facetChanged: function(){
      // Ensure we are dealing only with valid set names
      if (!setList.has(this.name)) throw 'invalid set name';
    },
    _getSetSymbol: function(name){
      return buildSetSymbolURL(name);
    },
    _validEV: function(name, _validContribs){

      for (var i = noEVSets.length - 1; i >= 0; i--) {
        if (contains(name, noEVSets[i])){
          return false;
        }
      };

      return true;

    },
    _isValidContribs: function(c, u, r, m) {
      return !(isNaN(c) || isNaN(u) || isNaN(r) || isNaN(m))
    },
    evDown: function(e){
      this.ev = e.detail;
    },
    evDetailsDown: function(e){
      let detail = e.detail;
      let ev = detail.EV;

      this.cContribution = roundPercent(detail.CommonContributed, ev);
      this.uContribution = roundPercent(detail.UncommonContributed, ev);
      this.rContribution = roundPercent(detail.RareContributed, ev);
      this.mContribution = roundPercent(detail.MythicContributed, ev);
    }

  });
})();