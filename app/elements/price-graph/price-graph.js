(function () {

  Polymer({
    is: 'price-graph',
    properties: {
       // Filters
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      set: {
        type: String,
        value: ' ',
        notify: true,
      },
      // Price source options
      mkmSource: {
        type: Boolean,
        value: false,
      },
      _prices: {
        type: Array,
        value: ()=> [],
        notify: true,
        observer: '_freshPrices',
      },
    },
    attached: function(){
      this.addEventListener('historical-prices', (e)=> this._newPrices(e));
      this._prepare();
    },
    _newPrices: function({detail:prices}){
      // Deals with new prices
      this._prices = prices;
    },
    _freshPrices: function(){
      // Ignore empty pricings
      if (this._prices.length === 0) return;

      this.draw();
    },
    _prepare: function(){ // Prepare set annotations.

      this._setAnnotations = [];

      let sets = Object.keys(setReleases);
      sets.forEach((set)=>{
        // Ensure we display only supported sets.
        if (!setList.has(set)) return;

        let display = document.createElement('iron-icon');
        display.src = buildSetSymbolURL(set);

        this._setAnnotations.push([setReleases[set], set, display]);
      });
    },
    _clear: function(){ // Clean out the old cruft
      let c = this.$.completeContainer;
      while(c.firstChild !== null){
        c.removeChild(c.firstChild);
      }
    },
    _refill: function(){ // Get ready for new cruft
      
      // Build the containers we need
      // [chart, slider, timeline]
      let containers = []
      let c = this.$.completeContainer;
      for (var i = 0; i < 3; i++) {
        containers.push(document.createElement('div'))
        c.appendChild(containers[i]);
      };

      return containers;
    },
    draw: function(){
      // Redraws the graph.
      this._clear();
      let [chart, slider, timeline] = this._refill();

      setupGraph(chart, slider, timeline, this._setAnnotations, this._prices);
    }
  });



  const day = 24 * 3600;
  const month = day * 30;
  const year = month * 12;

  // For future usage for selecting time length
  const zoomLevels = {
    'sixMonths': 6 * month, 
    'oneYear': year
  };

  // What kind of time gap we zoom to after we pass it.
  //
  // 3600 Seconds in an hour, 24 hours in a day, 30 days a month and
  // 12 months a year makes our zoom time half a year until we get more data.
  const zoomTime = 6 * month;

  // Containers are passed as an element
  // data as a list of two element lists with the first element being
  // a timestamp and the second the value
  //
  // Annotations of form [timestamp, textID, element]
  //
  // Transplanted from the polymer 0.5.dart version and refactored.
  function setupGraph (chartContainer, sliderContainer,
    timelineContainer, annotations,
    data) {

    // Convert points from a list of lists to a object
    let points = [];

    // Sometimes duplicate median points slip in, we detect these
    // and ignore them
    let usedTimes = new Set();

    // Figure out when the earliest set we have in this dataset was released
    // for annotation purposes
    let earliestTime = 1e20;
    data.forEach((p)=>{
      let {Time, Price} = p;

      if (usedTimes.has(Time)) return;
      
      points.push({x: Time, y: Math.round(Price) / 100})
      usedTimes.add(Time);

      if (earliestTime > Time){
        earliestTime = Time;
      }
    });

    // Set the color and cycle through till we get something pretty
    let palette = new Rickshaw.Color.Palette( { scheme: "cool" } );
    palette.color();
    palette.color();
    palette.color();

    // Declare the actual graph
    let graph = new Rickshaw.Graph( {
            element: chartContainer,
            renderer: 'multi',
            series: [ {
                    name: "USD",
                    color: palette.color(),
                    data: points.reverse(),
                    renderer: 'area'
            } ]
    } );

    
    // The horizon chart preview initialization
    let slider = new Rickshaw.Graph.RangeSlider.Preview({
      graph: graph,
      element: sliderContainer
    });

    // Axis creation
    let x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );

    let y_axis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        // Apparently right=left?
        orientation: 'right'
    });

    // Render basic componenets
    x_axis.render();
    y_axis.render();
    graph.render();

    // Everything after here can happen post-graph render

    // The details template for hovering on the graph
    //
    // Reads the y value as a float of precision 2 decimal places.
    let detail = new Rickshaw.Graph.HoverDetail({
      graph: graph,
      formatter: function(series, x, y) {
      let date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
      let swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
      let content = swatch + series.name + ": " + parseFloat(parseFloat(y).toFixed(2)) + '<br>' + date;
      return content;
    }
    });

    // Annotations
    let annotator = new Rickshaw.Graph.Annotate( {
      graph: graph,
      element: timelineContainer,
    } );

    let boringToCool = {};

    // Add the boring annotations
    for (let i = annotations.length - 1; i >= 0; i--) {
      let id = annotations[i][1];

      // Prevent duplicates!
      if(annotations[i][0] < earliestTime ||
        boringToCool[id] != undefined){
        // Skipped unused annotations
        continue;
      }

      // Add them with time, label
      annotator.add(annotations[i][0], id);
      
      // Allow us to translate between arbitrary annotations and their
      // element equivalents
      boringToCool[id] = annotations[i][2];
    };

    // Update to build the spacing we'll use
    annotator.update();

    let boring = timelineContainer.getElementsByClassName("annotation");

    // Slip in the actual annotations
    for (let i = boring.length - 1; i >= 0; i--) {
      let id = boring[i].textContent;
      let cool = boringToCool[id];

      if (cool == undefined) {
        continue;
      };


      boring[i].appendChild(cool);
    };

    let deltaTime = Math.floor(Date.now()/1000) - earliestTime;
    if (deltaTime > zoomTime) {
      // Set the slider to sit from now till now() - zoomTime

      // The width of the slidercontainer
      let totalWidth = sliderContainer.offsetWidth;  

      // Find the percent of time we occupy as zoomTime
      let percent = zoomTime / deltaTime;
      // Convert that percentage into a width
      let zoomWidth = percent * totalWidth;

      // This is awful, please do not be offended.
      // Rickshaw drove me to this madness
      // http://stackoverflow.com/questions/20826614/how-to-set-default-preview-width-to-rickshaw-graph-rangeslider
      let w = totalWidth;
      let t1 = totalWidth - zoomWidth;
      let t2 = totalWidth;
      let t0 = 0;

      let edown = document.createEvent("HTMLEvents");
      edown.initEvent("mousedown", true, true);
      edown.clientX = 0;
      let emove = document.createEvent("HTMLEvents");
      emove.initEvent("mousemove", true, true);
      emove.clientX = 0.9 * w * (t1 - t0) / (t2 - t0) ;
      let eup = document.createEvent("HTMLEvents");
      eup.initEvent("mouseup", true, true);

      let lHandle = sliderContainer.getElementsByClassName("left_handle")[0];
      lHandle.dispatchEvent(edown);
      //$('#slider .left_handle')[0].dispatchEvent(edown);
      document.dispatchEvent(emove);
      document.dispatchEvent(eup); 

    }
    


  }

})();