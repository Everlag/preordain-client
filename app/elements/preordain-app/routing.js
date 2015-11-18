
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
      app.setActive('home');

      title('preordain');
    });

    page('/card/:name/:set?', function (data) {
      app.cardParams = data.params;
      app.setActive('card');

      title(`${data.params.name}`);
    });

    page('/set/:set', function (data) {
      app.setParams = data.params;
      app.setActive('set');

      title(`${setToShort[displayToOfficialSets[data.params.set]]}`);
    });

    page('/sets', function (data) {
      app.setActive('sets');

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