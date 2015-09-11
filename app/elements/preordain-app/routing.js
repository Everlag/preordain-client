
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
      app.route = 'home';
    });

    page('/login', function () {
      app.route = 'login';
      app.viewed.login = true;
      app.viewedChanged();
    });

    page('/signup', function () {
      app.route = 'signup';
      app.viewed.signup = true;
      app.viewedChanged();
    });

    page('/trades/:name?', function (data) {
      // Default to our stored username
      // if the provided one is invalid
      if (!data.params.name) {
        data.params.name = mutable.name;
      }
      app.tradesParams = data.params;
      app.viewed.trades = true;
      app.route = 'trades';
      app.viewedChanged();
    });

    page('/reset/:name?', function (data) {
      app.resetParams = data.params;
      app.route = 'reset';
      app.viewed.reset = true;
      app.viewedChanged();
    });

    page('/card/:name/:set?', function (data) {
      app.cardParams = data.params;
      app.route = 'card';
      app.viewed.card = true;
      app.viewedChanged();
    });

    page('/set/:set', function (data) {
      app.setParams = data.params;
      app.route = 'set';
      app.viewed.set = true;
      app.viewedChanged();
    });

    page('/sets', function (data) {
      app.route = 'sets';
      app.viewed.sets = true;
      app.viewedChanged();
    });

    // add #! before urls
    page({
      hashbang: true
    });

  };


})();