(function () {

  // The markdown intermediate representation is html generated from
  // the markdown with at most one custom element command per line.
  //
  // Commands are notated <element-name property1="value"/>
  // This looks like a self-closing tag so the markdown compiler
  // doesn't start messing with it. Additionally, self-closing
  // tags are rarely, if ever, used which means html is still available
  // to be used if needed.
  //
  // By treating this as an intermediate representation, we can create
  // custom elements that the DOMParser ignores.

  // Processes the html-like intermediate representation
  // into html and creates custom dom nodes to insert.
  //
  // Returns valid html with injection points and a map[id]domNode
  let processIR = (ir)=>{

    // Define a test that will trap the input between
    // command end and start
    let test = /<(.*)\/>/;

    // A translation of an element id to a dom node
    let keyToNode = new Map();

    // Go line by line
    ir.split('\n').forEach((l)=>{
      let data = test.exec(l);

      if (data !== null){
        data = data[1];
        let node = parseIRCommand(data);
        let key = getID();

        keyToNode.set(key, node);

        // Perform a replacement on the IR to have
        // the DOMParser substitute a uniquely identified key
        ir = ir.replace(`<${data}/>`, `<span id="${key}">oh ho</span>`);
      }      
    });

    return [ir, keyToNode];
  };

  // Converts provided IR into valid DOM nodes
  let buildIR = (ir)=>{
    // Get hmtl and custom element translation
    let [html, keyToNode] = processIR(ir);

    // Setup a new content package
    let pack = document.createElement('div');

    // Parse the html
    let parsed = new DOMParser()
      .parseFromString(html, 'text/html').body.children;
    // Add into package
    Array.from(parsed).forEach((n)=> pack.appendChild(n));

    // Perform replacements of placeholder elements
    // with their custom element equivalents
    keyToNode.forEach((node, key)=> {
      let ref = pack.querySelector(`#${key}`);
      if (ref === null) return;
      ref.parentElement.insertBefore(node, ref);
      ref.parentElement.removeChild(ref);
    });

    return pack;
  };

  // Translates an intermediate representation command into an element
  let parseIRCommand = (command)=>{
    // Split on spaces not enclosed in quotes
    // Explicitly ignores single quotes and dashes
    let split = command
      .match(/([a-zA-Z-'0-9]+)|("[a-zA-Z-'0-9\s]+"?)\s?/g)
      .reverse();

    // Create the element
    let tag = split.pop();
    let node = document.createElement(tag);
    if (split.length % 2 !== 0) throw 'arguments must be in key="value" form';
    
    // Add the arguments
    for (var i = 0; i < split.length; i+= 2) {
      let key = split[i+1];
      let value = split[i].replace(/\"/g, '');
      node[key] = value;
    }

    return node;
  };

  // Returns a random 16 character string to use
  // for identification
  let getID = ()=>{
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz';
    while(text.length < 16) {
        text= text.concat(possible[(Math.floor(Math.random() * possible.length))]);
    }
    return text;
  };

  Polymer({
    is: 'preordain-md',
    properties: {
      work: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_workChanged'
      },
      status: {
        type: String,
        value: 'loading'
      }
    },
    _workChanged: function(work) {
      if (work.trim().length === 0) return;

      this.status = 'loading';

      let loc = urlBuilders.MarkdownURL(work);
    
      remoteComms.ajax('GET', loc, null,
        (c)=> this._success(c), ()=> this.status = 'error',
        'text/html');
    },
    _success: function(content){

      this.status = 'done';

      // Clear the content wrapper
      let wrap = Polymer.dom(this.$.contentWrap);
      let first = this.$.contentWrap.firstChild;
      if (first !== null) wrap.removeChild(first);

      // Setup a new content package
      let pack = buildIR(content);

      // Add the package to the wrapper
      wrap.appendChild(pack);
    },


  });

})();