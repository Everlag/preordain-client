/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

let started;

let finishLazyLoading = ()=>{
  // 6. Fade splash screen, then remove.
  let onImportLoaded = function() {
    let loadEl = document.getElementById('splash');
    loadEl.addEventListener('transitionend', loadEl.remove);

    document.body.classList.remove('loading');

    // App is visible and ready to load some data!
  };

  let link = document.querySelector('#bundle');

  // 5. Go if the async Import loaded quickly. Otherwise wait for it.
  // crbug.com/504944 - readyState never goes to complete until Chrome 46.
  // crbug.com/505279 - Resource Timing API is not available until Chrome 46.
  if (link.import && link.import.readyState === 'complete') {
    onImportLoaded();
  } else {
    link.addEventListener('load', onImportLoaded);
  }
}

(function(document) {
  'use strict';

  // Record when we start execution so we can determine startup time
  started = performance.now();

  // 4. Conditionally load the webcomponents polyfill if needed by the browser.
  // This feature detect will need to change over time as browsers implement
  // different features.
  let webComponentsSupported = ('registerElement' in document &&
      'import' in document.createElement('link') &&
      'content' in document.createElement('template'));

  if (!webComponentsSupported) {
    let script = document.createElement('script');
    script.async = true;
    script.src = webcomponentsPolyfill;
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
  } else {
    finishLazyLoading();
  }

})(document);
