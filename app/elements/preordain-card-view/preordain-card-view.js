(function () {
  Polymer({
    is: 'preordain-card-view',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
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
      }
    },
  });
})();