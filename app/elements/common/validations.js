// Validation of user input

// Returns whether or not a provided username is valid.
//
// A valid username is at least a character but less than 30.
function validUsername(name) {
	return name.length > 0 && name.length < 30;
}

// Returns whether or not a provided password is valid.
//
// A valid password is at least 10 characters but less than
// 255
function validPassword(password) {
	return password.length >= 10 && password.length < 255;
}

// Returns whether or not a provided email is validly formatted.
//
// A valid email respects RFC 2822. It might be fake, or not used,
// or used by someone else. This function just wants a reasonable email!
function validEmail(email) {
	var re = /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;
    return re.test(email);
}