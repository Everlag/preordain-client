(function () {
  Polymer({
    is: 'user-login',
    properties: {
      name: {
        type: String,
        value: ' ',
        notify: true,
      },
      _failed: {
        type: Boolean,
        value: false,
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
      };

      // Form the payload
      let payload = JSON.stringify({
        'password': this.input.password.value,
      });

      let url = buildLoginURL(this.input.username.value);

      ajaxJSON( 'POST', url, payload,
        (result)=> this._success(result),
        (result)=> this._failure());

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
      mutable.user.name = this.input.username.value;
      mutable.user.session = result.split('"').join('');
      console.log(mutable);
    },
    _failure: function(){
      // Clear the password field
      this.input.password.value = '';

      this._failed = true;

      // Shake the button for a moment
      indicateBadness(this.$.submitter);
    },

  });
})();