

/**
 * @desc - UI loading 
 */
UI.controller('AppLaunch',['$scope', function ($scope, $timeout, $watch, $apply, data) {
    $scope.ready = false;
    
    this.readyWatch = $scope.$watch( ready, function name(changedVal, lastVal) {
        console.log("ready state changed .");
        if(changedVal){
            this.hidePreloader(); 
        }
    });

    
    this.load = function () {
        setTimeout(function() {
            $scope.$apply(function(){
                $scope.ready = true;
            })
        }, 10000); //  10 sec 
    }

    this.hidePreloader = function () {
        $LogInfo("all done, Enjoy ! ", 0,null);
        toggleNotification = false;
        $('[data-main="content"]').removeClass('loading');
        $("#main-view").removeAttr("class");
        $("#desktopFooterWrapper").removeAttr("class");// remove the loading class
        $(".preloaderWrap-open").attr("class","preloaderWrap-closed");
        $(".preloader-open").attr("class","preloadep-cloed");
    }
    
    this.readyWatch(); // Initiate the ready watcher .
    this.load(); // Initiate the loader .

}]);

UI.controller('trackListCtrl', ['$scope', function ($scope, data) {
    
    this.trackScan = function (){
        return new Promise(function(){

        });
    }

    this.filter = function (){
        
    }

}]);


/**
 * @desc - Filter function 
 */
UI.controller('SearchFilter', ['$scope', function ($scope, data) {
    // Todo : Convert your origins list into angular items to be able to filter them .

}]);


/**
 * @desc - UI tabs  
 */
UI.controller('UITabs',['$scope', function ($scope, data) {

    this.index = 1; // Defualt page view 
    this.setView = function (index)  {
        this.index  = index;
    }
    this.getView = function (index) {
        return(this.index);
    }
}]);


/**
 * @desc - Error logs  
 */
UI.controller('UILogs',['$scope', function ($scope, data) {
    // @docs - ninja book page []
}]);


