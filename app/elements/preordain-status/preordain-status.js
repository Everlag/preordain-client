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
      }
    },
    _statusChanged: function(status){
      if (!statuses.has(status)) throw 'invalid status';

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