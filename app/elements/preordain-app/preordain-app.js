(function () {

  // Record when we initialize the app
  let started = new Date();

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
      cardViewed: {
        type: Boolean,
        value: false,
      },
      setViewed: {
        type: Boolean,
        value: false,
      },
      setsViewed: {
        type: Boolean,
        value: false,
      },
      loginViewed: {
        type: Boolean,
        value: false,
      },
      signupViewed: {
        type: Boolean,
        value: false,
      },
      tradesViewed: {
        type: Boolean,
        value: false,
      },
      resetViewed: {
        type: Boolean,
        value: false,
      },
    },
    attached: function() {
      
      // Build the routes!
      buildRoutes(this);

      // Show off the startup time
      let loaded = new Date();
      console.log(`Our app is ready to rock, start time is ${loaded-started}ms`);
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