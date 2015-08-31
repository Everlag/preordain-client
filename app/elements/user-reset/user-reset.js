(function () {
  Polymer({
    is: 'user-reset',
    properties: {
      name: {
        type: String,
        value: ' ',
      },
      _failed: {
        type: Boolean,
        value: false,
      },
      _captchaKey: {
        type: String,
        value: recaptchaPub,
      },
      _requestStatus: {
        type: String,
        value: 'done',
      },
      _resetStatus: {
        type: String,
        value: 'done',
      },
      _requestComplete: {
        type: Boolean,
        value: false,
      },
      _captchaStatus: { // Our captcha loading
        type: String,
        value: 'loading',
      },
      _small: { // Layout determined by screen size
        type: Boolean,
        value: false,
      }
    },
    ready: function() {
      this.input = {
        username: this.$.username,
        requestSubmitter: this.$.requestSubmitter,
        resetSubmitter: this.$.resetSubmitter,
        token: this.$.token,
        password: this.$.password,
        recaptcha: this.$.recaptcha,
      };

    },
    _submitRequest: function() {

      // Ensure everything follows the guidelines.
      let valid = this._validateRequest();
      if (!valid){
        indicateBadness(this.$.requestSubmitter);
        return;
      }

      // Perform the request, we don't actually care if it fails
      // as the server says yes everytime.
      remoteComms.requestReset(this.name,
        this.input.recaptcha.response,
        (result)=> this._requestDone(),
        (result)=> this._requestDone());

      // Start the spinner
      this._requestStatus = 'loading';

    },
    _submitReset: function() {

      // Ensure everything follows the guidelines.
      let valid = this._validateReset();
      if (!valid){
        indicateBadness(this.$.resetSubmitter);
        return;
      }

      // Form the payload
      let payload = JSON.stringify({
        'password': this.input.password.value,
        'ResetRequestToken': this.input.token.value,
      });

      let url = urlBuilders.ResetURL(this.name);

      remoteComms.submitReset(this.input.username.value,
        this.input.password.value,
        this.input.token.value,
        (result)=> this._resetSuccess(result),
        (result)=> this._resetFailure());

      // Start the spinner
      this._resetStatus = 'loading';

    },
    _validateRequest: function(){ // Validates current state of the login form.

      // Start with believing everything is happy
      let valid = true;

      if (!validUsername(this.input.username.value)) {
        this.input.username.invalid = true;
        valid = false;
        this._selectUserName();
      }else{
        this.input.username.invalid = false;
      }

      // Make sure the captcha is valid!
      if (this.input.recaptcha.response.length === 0) {
        valid = false;

        // Shake the captcha, its necessary
        indicateBadness(this.input.recaptcha);
      }

      return valid;

    },
    _validateReset: function() {
      let valid = true;

      if (!validPassword(this.input.password.value)) {
        this.input.password.invalid = true;
        valid = false;
        this._selectPassword();
      }else{
        this.input.password.invalid = false;
      }

      // Tokens change, but they're never less than 3
      // characters is length
      if (this.input.token.value.length < 3) {
        this.input.token.invalid = true;
        valid = false;
        this._selectToken();
      }else{
        this.input.token.invalid = false;
      }

      return valid;
    },
    _selectUserName: function(){
      this.input.username.inputElement.select();
    },
    _selectToken: function(){
      this.input.token.inputElement.select();
    },
    _selectPassword: function(){
      this.input.password.inputElement.select();
    },
    _requestDone: function(result) {
      // Stop the spinner
      this._requestStatus = 'done';
      this._requestComplete = true;

      // Clear the recaptcha and any response it had
      this.input.recaptcha.reset();
      this.input.recaptcha.response = '';
    },
    _resetSuccess: function(result){ // Reset completed correctly
      // Log them in with the completed result
      mutable.name = this.name;
      mutable.session = result.split('"').join('');

      // End the spinner
      this._resetStatus = 'done';
    },
    _resetFailure: function() {
      this._resetStatus = 'error';
    },
    _captchaLoaded: function() {
      // Turn the captcha spinner off
      this._captchaStatus = 'done';
    },

  });
})();