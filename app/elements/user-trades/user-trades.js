(function () {
  Polymer({
    is: 'user-trades',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_nameChanged',
      },
      _decorated: { // The trades intersped with set releases
        type: Array,
        value: ()=> [], 
      }
    },
    _nameChanged: function(){
      // We acquire public data if a name was specified.
      // Otherwise, we fetch private data for the logged in user.
      let pub = (this.name !== undefined);

      let effectiveName = this.name;
      let payload = null;
      let method = 'GET';
      if (!pub){
        effectiveName = mutable.name;
        payload = JSON.stringify({'sessionKey': mutable.session});
        method = 'POST';
      }

      let url = buildTradesURL(effectiveName,
        userDefaults.collection, pub);
      
      ajaxJSON(method, url, payload,
        (result)=> this._success(result),
        (result)=> this._failure());

    },
    _success: function(result) {
      let Historical = [];
      try{
        // [ignore] jshint seems to get unhappy with a
        // destructuring assignment that uses existing variables.
        /* jshint ignore:start */
        ({Historical} = JSON.parse(result));
        /* jshint ignore:end */
      }catch(e){
        this._failure();
      }

      // Compute individual trades from the bulk history then 
      // add metadata that assists with layout and UX
      let trades = addTradesUX(buildTrades(Historical));
      
      this._decorated = decorateTrades(trades);
    },
    _failure: function(){
      console.log('we messed up');
    }

  });
})();