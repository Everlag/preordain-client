(function () {

  // Bloodhound.tokenizers.whitespace but sets to lowercase first.
  function customTokenizer (s) {
    s = s.toString(s).toLowerCase();
    return s ? s.split(/\s+/) : [];
  }

  // A simple replacer that lets us lowercase the request before
  // sending it.
  function customReplacer (url, query) {
    query = query.toLowerCase();
    let freshUrl = url.replace("%QUERY", query);
    return freshUrl;
  }

  function getSuggestion(datum){
    // Perform some minor normalization for quoted names.
    //
    // Yes, those are actually two different versions of quotes
    let value = datum.name.replace('"', '&quot;').replace('"', '&quot;');
    return `<misc-typeahead-line suggestion="${value}"></misc-typeahead-line>`;;
  }

  Polymer({
    // A typeahead using the twitter typeahead.
    //
    // Fires the 'completed' event with the 'name' detail when a
    // choice has been made
    //
    // Leverages the misc-typeahead-line for single line easy templating.
    is: 'preordain-typeahead',
    properties: {
      // Typeahead options
      url: { // Where we fetch remotely from, defaults to global value
             // Set to an empty string to force hardOptions only.
        type: String,
        value: remote.typeAhead,
      },
      hardOptions: { // Locally populated options
        type: Array,
        value: ()=> [],
      },
      _smallDisplay: {
        type: Boolean,
        value: false,
      }
    },
    attached: function(){
      this.loaded = false;
      console.log('typeahead attached');
      this.loadTypeahead();

      // Set up the event listeners a single time.
      $('#visibleInput').on('typeahead:selected typeahead:autocompleted',
        (e, selection)=> this._fireResult(selection.name));
    },
    loadTypeahead: function(){
      if (this.loaded) throw 'typeahead already loaded';

      // Initialize the remote only if we actually want to
      let remote = null;
      if (this.url.trim().length > 0){
        remote = {
          url: this.url,
          replace: customReplacer,
           filter: function(list) {
              return $.map(list, function(name) { return { name: name}; });
          }
        }
      }

      var names = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
        queryTokenizer: customTokenizer,
        local: $.map(this.hardOptions, function(name) { return { name: name }; }),
        remote: remote,
        rateLimitWait: 500
      });

      names.initialize();

      $('#visibleInput').typeahead({
        hint: true,
        minLength: 1,
      }, {
        name: 'names',
        display: 'name',
        source: names.ttAdapter(),
        limit: 5,
        templates:{
          suggestion: getSuggestion
        }
      });

      this.loaded = true;
    },
    removeTypeahead: function(){
      // Remove it
      this.loaded = false;
    },
    // Sends a choice a user has made alongside some relevant metadata.
    _fireResult: function(selection){
      this.fire('completed', {
        'choice':selection,
        'isSet': setList.has(selection),
      });
    }


  });
})();