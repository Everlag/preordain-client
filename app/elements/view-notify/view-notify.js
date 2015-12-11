/** @polymerBehavior */
window.ViewNotifyBehavior = {};

// Provides the ability for a polymer element to easily detect when they
// are visible to the user.
//
// Elements using this must implement 
//   _viewNotify is used as callback when in view
//                and will be called every 100 milliseconds
//                as long as the element remains in view.
//
//                If _viewNotify returns a truthy value, checking
//                is halted.
//
// Additionally, elements must
// leave _ViewNotifyCheck available for internal use of view-notify.
ViewNotifyBehavior = {
  // Start the async check chain
  attached: function(){
    this.async(this._ViewNotifyCheck, 100);
  },
  // Perform a cheap check then callback if visible
  _ViewNotifyCheck: function() {

    // Check and fire reserved callback if available.
    //
    // The callback can return a truthy value to stop
    // any further checking, so we check that.
    if($(this).isOnScreen(0.1, 0.1)){
      let stop = this._viewNotify();
      if (stop) return;
    }

    // Set up the next check
    this.async(this._ViewNotifyCheck, 100);
  },
  // Make a fuss if the callback we need isn't present.
  _viewNotify: function(){
    let tagName = this.tagName.toLowerCase();
    throw `_viewNotify undefined in ${tagName}`;
  }
};