// Actual communication

// Fires an ajax request.
function ajaxJSON(method, url, body,
	success, failure) {

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
}