(function () {


  // The keying function used to encode
  // route-pairs for transitions.
  let tkey = (a)=> a.join();

  // The standard [exit, entry] pair
  // to 
  let standardTransition = [
    'slide-left-animation',
    'slide-from-right-animation'
  ];

  let backwardTransition = [
    'slide-right-animation',
    'slide-from-left-animation'
  ];

  // Converts a route array of form
  // [from, to]
  // into a transition pair of form
  // [exit, entry]
  let transitions = new Map();
  // Backward transitions, each from is spatially scoped
  // to be a subset of the from
  transitions.set(tkey(['card', 'set']), backwardTransition);
  transitions.set(tkey(['card', 'sets']), backwardTransition);
  transitions.set(tkey(['set', 'sets']), backwardTransition);

  Polymer({
    // preorda.in the Custom Element!
    is: 'preordain-app',
    properties: {
      route: {
        type: String,
        value: undefined,
        observer: '_newRoute'
      },
      // Intermediate used for adjusting animations
      // before they occur
      _cleanRoute: {
        type: String,
        value: '',
      },
      // Transition animations
      _entry: {
        type: String,
        value: 'slide-from-right-animation',
      },
      _exit: {
        type: String,
        value: 'slide-left-animation',
      },
      // Responsive layout
      big: {
        type: Boolean,
        value: false,
      },
      small: {
        type: Boolean,
        value: false,
      },
      // Parameters for views
      cardParams: {
        type: Object,
        value: ()=> {},
      },
      setParams: {
        type: Object,
        value: ()=> {},
      },
      tradeParams: {
        type: Object,
        value: ()=> {},
      },
      resetParams: {
        type: Object,
        value: ()=> {},
      },
      // Lazy initialization of sections
      viewed: {
        type: Object,
        value: ()=> {
          return {
            'card': false,
            'set': false,
            'sets': false,
          };
        },
      },
      // Knowledge of currently active route
      active: {
        type: Object,
        value: ()=> {
          return {
            'card': false,
            'set': false,
            'sets': false,
          };
        },
      },
    },
    attached: function() {

      // Build the routes!
      buildRoutes(this);

      // Show off the polymer startup time
      let loaded = performance.now();
      let polymerLoad = (loaded-started).toFixed();
      console.log(`Our app is ready to rock, start time is ${polymerLoad}ms`);

      // Show off absolute performance timing
      //
      // Defer for a moment to allow loadStart to fire
      this.async(()=> {
        let timing = performance.timing;
        let fullLoad = timing.loadEventStart - timing.navigationStart;
        console.log(`Absolute load time is ${fullLoad}ms`);
      }, 100);
    },
    // Notifies that a location has changed
    viewedChanged: function(){
      // Don't bother if its already been viewed
      this.viewed = JSON.parse(JSON.stringify(this.viewed));
    },
    // Lets the current route know its active
    setActive: function(view) {
      // Clear others
      for (let v in this.active) this.active[v] = false;
      // Set this
      this.active[view] = true;

      // Force the notification
      this.active = JSON.parse(JSON.stringify(this.active));
    },
    // Close drawer after menu item is selected if drawerPanel is narrow
    onMenuSelect: function(){
      var drawerPanel = this.$.paperDrawerPanel;
      if (drawerPanel.narrow) {
        drawerPanel.closeDrawer();
      }
    },
    typeaheadCompleted: function(e){
      let name = e.detail.choice;

      // Perform some navigation
      if (e.detail.isSet) {
        page(`/set/${name}`);
        return;
      }

      page(`/card/${name}`);

    },
    cardRequested: function({detail:{Name, Set}}){
      // Navigate to the desired card-set combo
      page(`/card/${Name}/${Set}`);
    },
    setRequested: function({detail:{Name}}){
      // Navigate to the desired set
      page(`/set/${Name}`);
    },
    _newRoute: function(fresh, old) {
      // Change animations contextually!
      let transition = transitions.get(tkey([old, fresh]));
      if (!transition) transition = standardTransition;
      [this._exit, this._entry] = transition;
      
      // Determine when to scroll the top content into view
      let isAnimating = ()=> {
        return document.querySelectorAll('.neon-animating').length !== 0;
      };
      let signalOnAnimEnd = ()=> {
        // Check if we're animating, if we are wait a moment
        // then check again
        if (isAnimating()){
          this.async(signalOnAnimEnd, 50);
          return;
        }

        // Scroll to the top of the page
        this.$.content.scrollIntoView();
      };
      // Let the animation start before checking
      // that its completed
      this.async(signalOnAnimEnd, 10);
      
      // Setup the viewed route
      this._cleanRoute = fresh;
    }

  });
})();