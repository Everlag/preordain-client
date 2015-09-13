(function () {
  Polymer({
    is: 'mtg-card',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      ImageLoc: {
        type: String,
        value: initialImage,
      },
      ManaCost: {
        type: String,
        value: ' ',
        notify: true,
      },
      Type: {
        type: String,
        value: ' ',
        notify: true,
      },
      Text: {
        type: String,
        value: ' ',
        notify: true,
      },
      TextLines: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      Printings: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      Power: {
        type: Number,
        value: NaN,
        notify: true,
      },
      Toughness: {
        type: Number,
        value: NaN,
        notify: true,
      },
      Loyalty: {
        type: Number,
        value: NaN,
        notify: true,
      },
      Colors: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      ColorIdentity: {
        type: String,
        value: ' ',
        notify: true,
      },
      isPlaneswalker: {
        type: Boolean,
        computed: 'hasLoyalty(Type)'
      },
      isCreature: {
        type: Boolean,
        computed: 'hasCombatStats(Type)'
      },
    },
    ready: function() {
      // nop
    },
    // Deal with all data changing
    freshData: function(e){

      let Legalities = {};
      let ImageName = '';

      // [ignore] jshint seems to get unhappy with a
      // destructuring assignment that uses existing variables.
      /* jshint ignore:start */
      ({
        ManaCost: this.ManaCost,
        Type: this.Type,
        Text: this.Text,
        Power: this.Power,
        Toughness:this.Toughness,
        Loyalty: this.Loyalty,
        Colors: this.Colors,
        Printings: this.Printings,
        ImageName,
      } = e.detail);
      /* jshint ignore:end */
    
      this.ModernBanned = Legalities.Modern !== 'Legal';
      this.LegacyBanned = Legalities.Legacy !== 'Legal';
      this.CommanderBanned = Legalities.Commander !== 'Legal';

      this.TextLines = this.Text.split('\n').map((t)=> t);

      this.ImageLoc = new URL(urlBuilders.ImageURL(ImageName)).href;

      if (this.Colors === null){
        this.ColorIdentity = 'artifact';
      }else{
        if (this.Colors.length > 2) {
          this.ColorIdentity = 'gold';
        }else if(this.Colors.length === 2){
          this.ColorIdentity = this.Colors.join('');
        }else if (this.Colors.length === 1){
          this.ColorIdentity = this.Colors[0].toLocaleLowerCase();
        }else if (this.Type.indexOf('Land')){
          this.ColorIdentity = 'artifact';
        }else{
          this.ColorIdentity = 'land';
        }
      }
    },
    hasCombatStats: function(Type){

      if (Type.indexOf('Creature') !== -1) {
        return true;
      }
      return false;
    },
    hasLoyalty: function(Type){
      if (Type.indexOf('Planeswalker') !== -1) {
        return true;
      }

      return false;
    }

  });
})();