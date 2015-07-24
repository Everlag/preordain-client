(function () {
  Polymer({
    is: 'preordain-card-view',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
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
    ready: function() {

    },
    // Deal with all data changing
    freshData: function(e){

      // let Legalities = {};
      // let ImageName = "";

      // ({
      //   ManaCost: this.ManaCost,
      //   Type: this.Type,
      //   Text: this.Text,
      //   Power: this.Power,
      //   Toughness:this.Toughness,
      //   Loyalty: this.Loyalty,
      //   Colors: this.Colors,
      //   Printings: this.Printings,
      //   ImageName,
      // } = e.detail);
    
    },

  });
})();