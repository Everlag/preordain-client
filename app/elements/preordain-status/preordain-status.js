(function () {

  let done = 'done';
  let error = 'error';
  let loading = 'loading';
  let statuses = new Set(['loading', 'error', 'done']);

  Polymer({
    is: 'preordain-status',
    properties: {
      // The current status of the element.
      //
      // Valid statuses and their behaviors are are:
      //  loading
      //    Spinner
      //  error
      //    warning message 
      //  done
      //    becomes hidden
      //
      // An invalid status is considered an error
      status: {
        type: String,
        value: ' ',
        notify: true,
        observer: '_statusChanged',
      },
      // The message to appear when status === error
      error: {
        type: String,
        value: ' ',
      },
      _isError: {
        type: Boolean,
        value: false,
      },
      _isLoading: {
        type: Boolean,
        value: false,
      },
    },
    _statusChanged: function(status){
      if (!statuses.has(status)) throw 'invalid status';

      // Typically the rest of this would be done
      // as a bunch of computed properties but
      // they are all modified by name so this seems sane
      // and cleaner

      // If we encountered an error we show it off
      if (status === error) {
        this._isError = true;
      }else{
        this._isError = false;
      }

      if (status === loading) {
        this._isLoading = true;
      }else{
        this._isLoading = false;
      }

      // If we're done, hide so we take up no space in the layout.
      if (status === done) {
        this.hidden = true;
      }else{
        this.hidden = false;
      }
    }

  });
  let end = new Date();

})();