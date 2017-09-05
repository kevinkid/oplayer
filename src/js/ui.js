/**
 * @desc - Main UI operations .
 * UI Operations
 * - These are things that are things that we will have to control
 * 	  when they are viewed .
 * 1. Different tabs with thier views .
 * 2. Displaying music details in the main view table .
 * 3. Loging application operations .
 * 4. Online tab which view responds with which music website i.e. soundcloud .
 */


var UI = angular.module('UIMain',[])
.factory('filter',[function () {
	console.log('factories running ...');
	// Todo : Learn how to use factories , i know they are a way of binding data to logic implementation .
	var welcome = "Welcom everyone ."
	// Angular global data
	// @note: store song tracks here .
	return {
		tracklist:['Array of tracks indexes ']
	}
}])
.config([function () {
	// Todo : Learn some different angular configurations .
	console.log("Angular configurations .");
}])
.run([function () {
	// Todo : Run when angular is finally initialised .
	console.log("Angular running ...");
   eventHandler.navigationListener();
}]);
