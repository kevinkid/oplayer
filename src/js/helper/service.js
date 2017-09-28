
var worker = {};
var imgLoaded = false;

worker.prototype.isOnline = function () {
    var imgSource = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    var temp = document.createElement("img");
    temp.setAttribute("temp-img","image");
    var bodyEl = document.body;
    temp.src = imgSource;
    bodyEl.appendChild(temp);
    $('[temp-img]').on('load', function(event) {
        imgLoaded = true;
    });
    imgLoaded = true;
}

worker.prototype.changeConnectionStatus = function (status) {
    worker.connected = status;
}

worker.prototype.pingConnection = function () {
    return imgLoaded;
}

worker.prototype.onWebRequest = function (ev) {
    if (ev.permission === "download") {
        this.requestDownload(ev);
    }
}

worker.prototype.requestDownload = function (ev) {
    e.request.allow();
}

document.body.ononline = function () {}
document.body.onoffline = function () {}    
