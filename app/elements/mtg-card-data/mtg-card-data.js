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
      // Rebuild the url
      this._url = buildCardURL(this.name);
    },
    hresponse: function(a,b,c){
      this.data = this.ajax.lastResponse;

      this.fire('data', this.data);
    }

  });
})();