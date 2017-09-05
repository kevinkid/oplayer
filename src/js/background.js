//Chrome external install 
// @docs: https://blog.chromium.org/2013/09/saying-goodbye-to-our-old-friend-npapi.html
// @docs: https://developer.chrome.com/native-client (pnacl) !important main choose	

chrome.app.runtime.onLaunched.addListener(function () {
    var midScreen = {
        width: window.screen.availWidth / 2,
        height: window.screen.availHeight / 2
    };
    chrome.app.window.create("../player.html",
	{
	    frame: "none",
	    id: "mainview",
	    innerBounds: {
	        width: 800,
	        height: 500,
	        left: midScreen.width,
	        minWidth: 800,
	        minHeight: 500,
	        maxWidth: 800,
	        maxHeight: 500,
	    },
	});
});

chrome.runtime.onInstalled = function () {
	// TODO: query the appStorage .
	console.info('chrome app installed ! ');
	appStorage.read();
}
