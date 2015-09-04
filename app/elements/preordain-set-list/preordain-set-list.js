(function () {
  Polymer({
    // A full list of supported sets
    is: 'preordain-set-list',
    properties: {
      _sets: {
        type: Array,
        value: ()=> [],
      },
    },
    attached: function() {
      // We store it as a set, we need it as an array
      let setArray = [];
      for (let s of displaySets){
        setArray.push(s);
      }
      // We don't want to deal with the foil counterpart!
      //
      // Also sort by descending timestamp
      this._sets = setArray
        .filter((s)=> !s.includes('Foil'))
        .sort((a, b)=> displaySetReleases[a] - displaySetReleases[b])
        .reverse();
    },
    requestSet: function(e){
      let data = {
        Name: e.model.item,
      };
      
      this.fire('request-set', data);
    }

  });
})();