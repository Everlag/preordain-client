(function () {

  Polymer({
    // preorda.in the Custom Element!
    is: 'preordain-app',
    properties: {
      route: {
        type: String,
        value: 'home',
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
            'login': false,
            'signup': false,
            'trades': false,
            'reset': false,
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

  });
})();