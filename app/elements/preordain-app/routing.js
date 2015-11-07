
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
      app.setActive(app.route);

      title('preordain');
    });

    page('/card/:name/:set?', function (data) {
      app.cardParams = data.params;
      app.route = 'card';
      app.viewed.card = true;
      app.viewedChanged();
      app.setActive(app.route);

      title(`${data.params.name}`);
    });

    page('/set/:set', function (data) {
      app.setParams = data.params;
      app.route = 'set';
      app.viewed.set = true;
      app.viewedChanged();
      app.setActive(app.route);

      title(`${setToShort[displayToOfficialSets[data.params.set]]}`);
    });

    page('/sets', function (data) {
      app.route = 'sets';
      app.viewed.sets = true;
      app.viewedChanged();
      app.setActive(app.route);

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