(function () {
  Polymer({
    is: 'user-signup',
    properties: {
      _failed: {
        type: Boolean,
        value: false,
      },
      _captchaKey: {
        type: String,
        value: recaptchaPub,
      },
      _status: { // Status of remote request
        type: String,
        value: 'done',
      },
      _captchaStatus: { // Our captcha loading
        type: String,
        value: 'loading',
      }
    },
    ready: function() {
      this.input = {
        username: this.$.username,
        email: this.$.email,
        password: this.$.password,
        recaptcha: this.$.recaptcha,
      };

    },
    _submit: function() {

      // Ensure everything follows the guidelines.
      let valid = this._validate();
      if (!valid){
        indicateBadness(this.$.submitter);
        return;
      }
      
      remoteComms.signup(this.input.username.value,
        this.input.email.value,
        this.input.password.value,
        this.input.recaptcha.response,
        (result)=> this._addedUser(result),
        (result)=> this._failure());

      // Start the spinner
      this._status = 'loading';

    },
    _validate: function(){ // Validates current state of the login form.

      // Start with believing everything is happy
      let valid = true;

      if (!validUsername(this.input.username.value)) {
        this.input.username.invalid = true;
        valid = false;
        this._selectUserName();
      }else{
        this.input.username.invalid = false;
      }

      if (!validEmail(this.input.email.value)) {
        this.input.email.invalid = true;
        valid = false;
        this._selectEmail();
      }else{
        this.input.email.invalid = false;
      }

      if (!validPassword(this.input.password.value)) {
        this.input.password.invalid = true;
        valid = false;
        this._selectPassword();
      }else{
        this.input.password.invalid = false;
      }

      // Make sure the captcha is valid!
      if (this.input.recaptcha.response.length === 0) {
        valid = false;

        // Shake the captcha, its necessary
        indicateBadness(this.input.recaptcha);
      }

      return valid;

    },
    _selectUserName: function(){
      this.input.username.inputElement.select();
    },
    _selectEmail: function() {
      this.input.email.inputElement.select();
    },
    _selectPassword: function(){
      this.input.password.inputElement.select();
    },
    _addedUser: function(result) {
      // Set the global state to represent our result
      mutable.name = this.input.username.value;
      mutable.session = result.split('"').join('');
      console.log(mutable);

      // Add a new collection
      this._addDefaultCollection(mutable.name, mutable.session);
    },
    _success: function(){
      // End the spinner
      this._status = 'done';

      // Navigate to the trade list
      page('/trades');
    },
    _failure: function(){
      // Clear the recaptcha and any response it had
      this.input.recaptcha.reset();
      this.input.recaptcha.response = '';

      this._failed = true;

      // Shake the button for a moment
      indicateBadness(this.$.submitter);

      this._status = 'error';
    },
    _forgot: function(){ // Send them over to /reset
      // We can't use the wonderful string templating features
      // here as the input is user controlled :(
      page('/reset/' + this.input.username.value);
    },
    _captchaLoaded: function() {
      // Turn the captcha spinner off
      this._captchaStatus = 'done';
    },
    _addDefaultCollection: function(name, sessionKey) {

      remoteComms.addCollection(name, sessionKey,
        (result)=> this._success(),
        (result)=> this._failure());

    }

  });
})();