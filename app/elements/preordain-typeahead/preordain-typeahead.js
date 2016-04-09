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
    let freshUrl = url.replace('%QUERY', query);
    return freshUrl;
  }

  function getSuggestion(datum, showPrices){
    // Perform some minor normalization for quoted names.
    //
    // Yes, those are actually two different versions of quotes
    let value = datum.name.replace('"', '&quot;').replace('"', '&quot;');
    let pricesOption = '';
    if (showPrices) pricesOption = 'show-prices';
    return `<misc-typeahead-line suggestion="${value}" ${pricesOption}></misc-typeahead-line>`;
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
      // Display options
      placeholder: {
        type: String,
        value: 'Card or Set',
      },
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
      showSets: { // Whether or not to include sets in hardcoded options
        type: Boolean,
        value: false,
      },
      showPrices: { // Whether or not to show prices per card
        type: Boolean,
        value: false,
      },
      limit: {
        type: Number,
        value: 5,
        notify: true,
      },
      _small: {
        type: Boolean,
        value: false,
      }
    },
    attached: function(){
      this.loaded = false;
      this.loadTypeahead();

      // Set up the event listeners a single time.
      $(this.$.visibleInput)
      .on('typeahead:selected typeahead:autocompleted',
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
          filter: (list)=> {
            // Filter choices down to the limit
            list = list
              .slice(0, this.limit);
            return list.map((s)=> {
              return {name: s};
            });
          }
        };
      }

      // Spread operator is borked in this babel release, getting an
      // 'Array.from is not a function' error, falling back to es5
      let preloaded = this.hardOptions.concat();
      if (this.showSets) {
        displaySets.forEach((s)=> preloaded.push(s));
      }
      preloaded = preloaded.filter((s)=> !s.includes(' Foil'));

      // Make sure we are sorted by lexicographic order.
      //
      // This ensures that foil sets don't appear before their
      // normal version.
      preloaded.sort();

      var names = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: customTokenizer,
        local: preloaded.map((s)=> {
              return {name: s};
        }),
        remote: remote,
        rateLimitWait: 250
      });

      names.initialize();

      // We need to pass the state of 'showPrices'
      // into the suggestion builder so we wrap it for
      // typeahead consumption
      let wrappedSuggestion = (d)=> getSuggestion(d, this.showPrices);

      $(this.$.visibleInput).typeahead({
        hint: true,
        minLength: 1,
      }, {
        name: 'names',
        display: 'name',
        source: names.ttAdapter(),
        limit: this.limit,
        templates:{
          suggestion: wrappedSuggestion,
          pending: `<span class="vertical layout center flex">
            <preordain-status status="loading"></preordain-status>
            waiting
          </span>`,
          notFound: `<preordain-status status="error" error="Nothing Found"></preordain-status>`,
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

      // Remove focus from the typeahead to hide any mobile keyboards.
      if (this._small) document.activeElement.blur();

      this.fire('completed', {
        'choice':selection,
        'isSet': displaySets.has(selection),
      });

      // Clear the current value
      //
      // Mobile users don't want to have to backspace for
      // a new search.
      this.setValue('');
    },
    // Cleanly sets the value of the typeahead
    setValue: function(v) {
      $(this.$.visibleInput).typeahead('val', v);
    },
    selectInput: function() {
      this.$.visibleInput.focus();
    }


  });
})();