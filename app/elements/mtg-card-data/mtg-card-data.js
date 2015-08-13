(function () {
  Polymer({
    is: 'mtg-card-data',
    properties: {
      data: {
        type: Object,
        notify: true,
      },
      name: {
        type: String,
        value: '',
        notify: true,
        observer: '_nameChanged',
      },
      _url: {
        type: String,
        value: '',
      }
    },
    ready: function() {
      this.ajax = this.$.ajax;
    },
    _nameChanged: function(){
      // Avoid fetching blank names
      if (this.name.trim().length === 0) return;
      // Rebuild the url
      this._url = buildCardURL(this.name);
    },
    hresponse: function(){

      if (this.name.trim().length === 0) return;

      this.data = this.ajax.lastResponse;

      // Filter and convert printings so we only display
      // supported sets and only display those sets with
      // normalized names that users can rely on.
      let Printings = this.data.Printings;
      // Check the official set.
      Printings.filter((s)=> setList.has(s));
      // Convert to our internal representation
      Printings = Printings.map((s)=> officialToDisplaySet(s));

      this.data.Printings = Printings;

      this.fire('data', this.data);
    }

  });
})();