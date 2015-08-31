// Actual communication

let remoteComms = {};

{

  // Fires an ajax request.
  remoteComms.ajaxJSON = (method, url, body, success, failure) => {

    var request = new XMLHttpRequest();

    request.open(method, url);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE ) {
            if(request.status === 200){
                success(request.response);
            }
            else if(request.status >= 400 && request.status <= 600) {
                failure();
            }
        }
    };

    request.send(body);
  };

  // Acquires all trades from remote source
  //
  // Calls success with results and failure with nothing
  remoteComms.getTrades = (name, sessionKey, isPublic, success, failure) => {
    let payload = null;
    let method = 'GET';

    if (!isPublic){
      payload = JSON.stringify({'sessionKey': sessionKey});
      method = 'POST';
    }

    let url = urlBuilders.TradesURL(name,
      userDefaults.collection, isPublic);

    remoteComms.ajaxJSON(method, url, payload,
      success, failure);
  };

  // Attempts to acquire a new user account for a user
  remoteComms.signup = (name, email, password, catpcha, success, failure) => {
    // Form the payload
    let payload = JSON.stringify({
      'email': email,
      'password': password,
      'recaptchaResponseField': catpcha,
    });

    let url = urlBuilders.SignupURL(name);

    remoteComms.ajaxJSON('POST', url, payload,
      success, failure);
  };

  // Attempts to acquire a new session for a user
  remoteComms.login = (name, password, success, failure) => {
    // Form the payload
    let payload = JSON.stringify({
      'password': password,
    });

    let url = urlBuilders.LoginURL(name);

    remoteComms.ajaxJSON('POST', url, payload,
      success, failure);
  };

  // Adds the default collection to a user
  remoteComms.addCollection = (name, sessionKey, success, failure) => {
    let payload = JSON.stringify({
      'sessionKey': sessionKey,
    });
    let method = 'POST';

    let url = urlBuilders.AddCollectionURL(name,
      userDefaults.collection);

    remoteComms.ajaxJSON('POST', url, payload,
      success, failure);
  };

  // Adds a card to the default collection
  /* Example card
      https://beta.perfectlag.me/api/Users/everlag/Collections/Inventory/Trades
    
    {
      "Name":"Evolving Wilds",
      "Set":"Duel Decks: Ajani vs. Nicol Bolas",
      "Quantity":1,
      "Comment":"more sanity",
      "LastUpdate":"2015-08-16T06:10:09.974Z",
      "Quality":"NM",
      "Lang":"EN"
    }
  */ 
  remoteComms.addCard = (name, sessionKey, card, success, failure) => {
    let payload = JSON.stringify({
      'sessionKey': sessionKey,
      'trade': [card],
    });

    let method = 'POST';
    let url = urlBuilders.AddItemURL(name, userDefaults.collection);
    remoteComms.ajaxJSON(method, url, payload,
      success, failure);
  };

  remoteComms.requestReset = (name, captcha, success, failure) => {
    // Form the payload
    let payload = JSON.stringify({
      'recaptchaResponseField': captcha,
    });

    let url = urlBuilders.ResetRequestURL(name);

    remoteComms.ajaxJSON( 'POST', url, payload,
      success, failure);
  };

  remoteComms.submitReset = (name, password, resetToken, success, failure) => {
    /// Form the payload
    let payload = JSON.stringify({
      'password': password,
      'ResetRequestToken': resetToken,
    });

    let url = urlBuilders.ResetURL(name);

    remoteComms.ajaxJSON( 'POST', url, payload,
      success, failure);
  };


}