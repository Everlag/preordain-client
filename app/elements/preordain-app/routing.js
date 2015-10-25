
let buildRoutes;

(function () {

  // Set the window title to whatever we need
  let title = (t)=>{
    document.title = t;
  };

  buildRoutes = (app)=>{

    // We use Page.js for routing. This is a Micro
    // client-side router inspired by the Express router
    // More info: https://visionmedia.github.io/page.js/
    //
    // All navigation goes through this. Thus, we use this to lazily
    // load sections as they are viewed
    page('/', function () {
      app.route = 'home';

      title('preordain');
    });

    page('/login', function () {
      app.route = 'login';
      app.viewed.login = true;
      app.viewedChanged();

      title('Login');
    });

    page('/signup', function () {
      app.route = 'signup';
      app.viewed.signup = true;
      app.viewedChanged();

      title('Signup');
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

      title('Trades');
    });

    page('/reset/:name?', function (data) {
      app.resetParams = data.params;
      app.route = 'reset';
      app.viewed.reset = true;
      app.viewedChanged();

      title('Reset');
    });

    page('/card/:name/:set?', function (data) {
      app.cardParams = data.params;
      app.route = 'card';
      app.viewed.card = true;
      app.viewedChanged();

      title(`${data.params.name}`);
    });

    page('/set/:set', function (data) {
      app.setParams = data.params;
      app.route = 'set';
      app.viewed.set = true;
      app.viewedChanged();

      title(`${setToShort[displayToOfficialSets[data.params.set]]}`);
    });

    page('/sets', function (data) {
      app.route = 'sets';
      app.viewed.sets = true;
      app.viewedChanged();

      title('Setlist');
    });

    // add #! before urls
    page({
      // Declared in index.html so it
      // can be populated in the build process
      hashbang: hashbang
    });

  };


})();