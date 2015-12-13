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
// Additionally, elements must leave all properties and methods
// declared in this behavior unchanged except the special
// case of _viewNotify.
//
ViewNotifyBehavior = {
  properties: {
    // Handle of next async check, explicitly null
    // when we have none scheduled
    _checkHandle: {
      type: Number,
      value: null,
    }
  },
  // Start the async check chain
  attached: function(){
    this._ViewNotifyStartCheck();
  },
  // Perform a cheap check then callback if visible.
  _ViewNotifyCheck: function() {

    // Check and fire reserved callback if available.
    //
    // The callback can return a truthy value to stop
    // any further checking, so we check that.
    if($(this).isOnScreen(0.1, 0.1)){
      let stop = this._viewNotify();
      if (stop){
        this._checkHandle = null;
        return;
      }
    }

    // Set up the next check
    this._checkHandle = this.async(this._ViewNotifyCheck, 100);
  },
  // Begins checking for visibility if we aren't already visible.
  //
  // Use this to restart checking if we previously halted checking
  // due to the callback return value.
  //
  // Calling when a check is already scheduled results in a nop
  _ViewNotifyStartCheck: function(){
    if (this._checkHandle) return;

    this._checkHandle = this.async(this._ViewNotifyCheck, 100);
  },
  // Make a fuss if the callback we need isn't present.
  _viewNotify: function(){
    let tagName = this.tagName.toLowerCase();
    throw `_viewNotify undefined in ${tagName}`;
  }
};