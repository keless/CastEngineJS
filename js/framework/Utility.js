//#include js/framework/EventDispatcher

function getRand(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min
}

//get dictionary length
function dicLength( dictionary ) {
	return Object.keys(dictionary).length;
}

function arrayContains( array, element ) {
	if (array.some(function(e){ return e == element; })) return true;
	return false;
}


//fnCallback = function (data)  where data = null on error
function getJSON( url, fnCallback ) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	
	request.onload = function() {
		if ((this.status >= 200 && this.status < 400) || (this.status == 0 && this.response)) {
			// Success!
			var data = JSON.parse(this.response);
			fnCallback(data);
		} else {
			console.error("unable to download " + url + " error: " + this.status + " " + this.statusText);
			// We reached our target server, but it returned an error
			fnCallback(null);
		}
	};
	
	request.onerror = function() {
		console.error("unable to download " + url + " unable to connect");
		// There was a connection error of some sort
		fnCallback(null);
	};
	
	request.send();
}
