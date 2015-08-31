(function () {
  Polymer({
    is: 'user-login',
    properties: {
      _failed: {
        type: Boolean,
        value: false,
      },
      _status: {
        type: String,
        value: 'done',
      }
    },
    ready: function() {
      this.input = {
        username: this.$.username,
        password: this.$.password,
      };

    },
    _submit: function() {

      // Ensure everything follows the guidelines.
      let valid = this._validate();
      if (!valid){
        indicateBadness(this.$.submitter);
        return;
      }

      // Form the payload
      let payload = JSON.stringify({
        'password': this.input.password.value,
      });

      let url = urlBuilders.LoginURL(this.input.username.value);

      remoteComms.login(this.input.username.value,
        this.input.password.value,
        (result)=> this._success(result),
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

      if (!validPassword(this.input.password.value)) {
        this.input.password.invalid = true;
        valid = false;
        this._selectPassword();
      }else{
        this.input.password.invalid = false;
      }

      return valid;

    },
    _selectUserName: function(){
      this.input.username.inputElement.select();
    },
    _selectPassword: function(){
      this.input.password.inputElement.select();
    },
    _success: function(result){
      // Set the global state to represent our result
      mutable.name = this.input.username.value;
      mutable.session = result.split('"').join('');
      console.log(mutable);

      // End the spinner
      this._status = 'done';

      // Navigate to the trade list
      page('/trades');
    },
    _failure: function(){
      // Clear the password field
      this.input.password.value = '';

      this._failed = true;

      // Shake the button for a moment
      indicateBadness(this.$.submitter);

      this._status = 'error';
    },
    _forgot: function(){ // Send them over to /reset
      // We can't use the wonderful string templating features
      // here as the input is user controlled :(
      page('/reset/' + this.input.username.value);
    }

  });
})();