
let buildRoutes;

(function () {

  buildRoutes = (app)=>{

    // We use Page.js for routing. This is a Micro
    // client-side router inspired by the Express router
    // More info: https://visionmedia.github.io/page.js/
    //
    // All navigation goes through this. Thus, we use this to lazily
    // load sections as they are viewed
    page('/', function () {
      // app.route = 'home';
    });


    page('/u/:name/:collection', function (data) {
      app.params = data.params;
      // app.route = 'user-info';
      console.log(app.params);
    });

    page('/login', function () {
      app.route = 'login';
      app.loginViewed = true;
    });

    page('/signup', function () {
      app.route = 'signup';
      app.signupViewed = true;
    });

    page('/trades/:name?', function (data) {
      // Default to our stored username
      // if the provided one is invalid
      if (!data.params.name) {
        data.params.name = mutable.name;
      }
      app.tradesParams = data.params;
      app.tradesViewed = true;
      app.route = 'trades';
    });

    page('/reset/:name?', function (data) {
      app.resetParams = data.params;
      app.route = 'reset';
      app.resetViewed = true;
    });

    page('/card/:name/:set?', function (data) {
      app.cardParams = data.params;
      app.route = 'card';
      app.cardViewed = true;
    });

    page('/set/:set', function (data) {
      app.setParams = data.params;
      app.route = 'set';
      app.setViewed = true;
    });

    page('/sets', function (data) {
      app.route = 'sets';
      app.setsViewed = true;
    });

    // add #! before urls
    page({
      hashbang: true
    });

  };


})();