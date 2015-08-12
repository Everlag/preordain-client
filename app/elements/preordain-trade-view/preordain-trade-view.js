(function () {
  Polymer({
    is: 'preordain-trade-view',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_nameChanged',
      },
      _big: {
        type: Boolean,
        value: false,
      }
    },
    _nameChanged: function(){
      
    },
  });
})();