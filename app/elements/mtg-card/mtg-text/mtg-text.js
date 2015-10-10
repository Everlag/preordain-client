(function () {
  Polymer({
    is: 'mtg-text',
    properties: {
      text: {
        type: String,
        notify: true,
        observer: '_textChanged',
      },
    },
    _textChanged: function() {
      this._populate(this._cleanText(this.text));
    },
    _cleanText: function(t){

      let noReminders = '';

      // First go through and remove reminder text.
      for (let section of t.split('(')){
        if (section.indexOf(')') === -1) {
          noReminders+= section;
        }
      }

      let cleaned = [];
      // Convert to svg symbols where possible.
      for (let section of noReminders.split('{')){
        if (section.indexOf('}') !== -1) {
          // Split, the left hand side is a set symbol, the right is text.
          let [symbol, text] = section.split('}');
          if (symbol.length > 0) {
            let symbolElement = document.createElement('iron-icon');
            symbolElement.src = urlBuilders.SymbolURL(symbol);
            cleaned.push(symbolElement);
          }
          if (text.length > 0) {
            let textElement = document.createElement('span');
            textElement.textContent = text;
            cleaned.push(textElement);
          }
        }else{
          let textElement = document.createElement('span');
          textElement.textContent = section;
          cleaned.push(textElement);
        }
      }

      return cleaned;

    },
    _populate: function(cleaned){
      let holster = this.$.text;

      // Empty it
      while (holster.firstChild){
        Polymer.dom(holster).removeChild(holster.firstChild);
      }

      // Fill it
      for (let t of cleaned)
        Polymer.dom(holster).appendChild(t);
    }

  });
})();