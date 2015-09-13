(function () {
  Polymer({
    is: 'preordain-card-spread',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      primary: {
        type: String,
        value: sources.mtgprice,
        notify: true,
      },
      secondary: {
        type: String,
        value: sources.mkm,
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
      },
      massive: {
        type: Boolean,
        value: false,
        notify: true,
      }
    },
    freshData: function({detail}){

      // [ignore] jshint seems to get unhappy with a
      // destructuring assignment that uses existing variables.
      ({Printings: this.Printings} = detail); // jshint ignore:line
    },
  });
})();