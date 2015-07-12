(function () {
  Polymer({
    is: 'preordain-card-info',
    properties: {
      name: {
        type: String,
        value: '',
        notify: true,
      },
      Printings: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      Reserved: {
        type: Boolean,
        value: false,
        notify: true,
      },
      SimilarCards: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      CommanderUsage: {
        type: String,
        value: ' ',
        notify: true,
      },
      ModernDecks: {
        type: Array,
        value: ()=> [],
        notify: true,
      },
      ModernBanned: {
        type: Boolean,
        value: false,
        notify: true,
      },
      LegacyBanned: {
        type: Boolean,
        value: false,
        notify: true,
      },
      CommanderBanned: {
        type: Boolean,
        value: false,
        notify: true,
      },
    },
    freshData: function(e){

      let Legalities = {};

      ({
        Printings: this.Printings,
        SimilarCards: this.SimilarCards,
        Reserved: this.Reserved,
        CommanderUsage: this.CommanderUsage,
        ModernPlay:{Decks: this.ModernDecks},
        Legalities,
      } = e.detail);
    
      this.ModernBanned = Legalities.Modern !== 'Legal';
      this.LegacyBanned = Legalities.Legacy !== 'Legal';
      this.CommanderBanned = Legalities.Commander !== 'Legal';

    }


  });
})();