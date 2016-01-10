(function () {
  Polymer({
    is: 'preordain-card-view',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_nameChanged',
      },
      Printings: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      big: {
        type: Boolean,
        value: false,
        notify: true,
      },
      massive: {
        type: Boolean,
        value: false,
        notify: true,
      }
    },
    _nameChanged: function(){
      // Let the parent know any recorded scroll position is now
      // completely invalid
      this.fire('discard-scroll', 'card');
    },
  });
})();