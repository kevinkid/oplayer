(function ($) {
// @desc: tell us if the user is online or if user's app is offline
	var imgLoaded = false,
	isOnline = false;
	// NOTE: This listeners only check for a network connection, maybe use them to check for connectivity changes .
	var onlinecheck = document.body.ononline = function () {
		// online handle
		console.info("website online ");
	}
	var offlinecheck = document.body.onoffline = function () {
		// offline handle
		console.info("website offline ");
	}

	var imgSource = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";

	function test() {
		var temp = document.createElement("img");
		temp.setAttribute("temp-img","image");
		var tag = document.body;
		temp.src = imgSource;
		tag.appendChild(temp);
		// @note: find code samples from the snapshare project

		$('[temp-img]').on('load', function(event) {
			event.preventDefault();

			imgLoaded = true;

		});;

		imgLoaded = true;

	}
	test();
	function ping() {
		if (imgLoaded) {
			//@todo: change to a file instead .
			$("webview")[0].src = "http://localhost:9000/install";
		}else {
			$("vebview")[0].src = "http://localhost:9000/offline";
		}
	}

	// setTimeout(ping,5000);

})(jQuery);
