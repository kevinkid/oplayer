/**
 * @desc - Animation logic and Elements used through out the application .
 * @todo - Add in the external extension install link and for the application .
 */
var app = {},
    DefaultTTL = 2500,//[ms]
    LogInformationList = [],
    LogAnimationTimeElapsed = true,
    lastInnerEle,
    ShuffleOn = false,
    LoopOn = false;

app.DEFAULTS = {
    storageLimit : 96781243, // TODO: 5Mbs Find out the limit 
    playerDefaults: {
        VOLUME: 0.01,
        REPEAT: true,
        SHUFFLE: false
    }
}


app.shuffle = true;

app.repeat = false;


/**
 * @param  {Number} - number of characters to be generated
 * @return {String} - Alphanumeric key string
 */
function chromeExtensionkeygen(length) {
    var str = '';
    if (length) {
        for (; str.length < length; str += Math.random().toString(36).substr(2));
        { return str.substring(0, length); }
    } else {
        for (; str.length < length; str += Math.random().toString(36).substr(2));
        { return str.substring(0, 10); }
    }
}

// NOTE: The json file found in the that directory is used to install the extension .
var installPath = {
    linux: '/etc/opt/chrome/native-messaging-hosts/hostname.json',
    windows: 'com.google.chrome.example.echo" /ve /t REG_SZ /d "%~dp0com.google.chrome.example.echo-win.json" /f"',
    mac: '/Users/mac/Library/Application Support/Google/Chrome/NativeMessagingHosts/hostname.json',
    macOther: '/Users/mac/Library/Application Support/Google/Chrome/NativeMessagingHosts/hostname.json'
};

/**
 * @todo - Get user's root path, maybe using a file picker
 * @returns {String} - root path to the install path
 */
function getRootPath(which) {
    return '';
}

/**
 * @param {String} - platform
 */
function hostInstallPath(which) {
    // NOTE: the hostname.json file should match the name of the host executable
    // NOTE: linux is name is unknown here . found out which name the platform is identified by.
    switch (which) {
        case 'win': return `${getRootPath(which)}/${installPath.windows}`; break;
        case 'mac': return `${getRootPath(which)}${installPath.mac}`; break;
        case 'macOther': return `${getRootPath(which)}${installPath.macOther}`; break;
        case 'linux': return `${getRootPath(which)}${installPath.linux}`; break;
    }
}


//desc: defines the installation by initiating a saveFile prompt to the user this is depending on the platform
function getInstallPath(install) {
    var descText = "Please navigate to /$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts";
    chrome.fileSystem.chooseEntry(
        {
            type: "saveFile",
            suggestedName: "com.google.chrome.example.echo.json",
            accepts: [{
                description: descText,
                extensions: ["json"]
            }],
            acceptsAllTypes: false
        }, function (entry) {
            chrome.fileSystem.getDisplayPath(entry, function (d) {
                console.log(d);
            });
            install(entry);
            chrome.storage.local.set({ folder: chrome.fileSystem.retainEntry(folder) })
            chrome.storage.local.get("folder", function (storage) {
                chrome.fileSystem.restoreEntry(storage.folder, function (folder) {
                    entry.moveTo(folder)

                })
            });
            console.log(entry);
        });
}


// Second alternative to installing the extension
function install(path) {

    // write the file
    path.createWriter(function (writer) {
        var fBlob = new Blob('[' +
            '// WARNING: This file is auto generated, edits will be lost .' +
                '{' +
                  '"name": "com.google.chrome.example.echo",' +
                  '"description": "Chrome Native Messaging API Example Host",' +
                  '"path": "HOST_PATH",' +
                  '"type": "stdio",' +
                  '"allowed_origins": [' +
                    '"chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik/"/*@todo: use the key generator*/' +
                  ']' +
                '}' +
          ']',
          { type: "text/json" }
          );
        writer.onWriteend = function () {
            console.log("Finisheded installation .");
        }
        writer.write(fBlob);
    });
}



/** @desc - creating customm context menu */
function createContextMenuItem(_id, _idx) {
    chrome.contextMenus.create({
        title: _id,
        type: 'normal',
        id: _idx,
        documentUrlPatterns: ["chrome-extension://*/player.html"],
        contexts: ['all']
    });
}

/** @desc - update custom context menu */
function updateContextMenuItem(_id) {
    chrome.contextMenus.update({
        title: _id,
        type: 'normal',
        id: _id,
        documentUrlPatterns: ["chrome-extension://*/player.html"],
        context: ["all"]
    });
}

/** @desc  - remove custom context menu */
function removeContextMenuItem(_id) {
    if (_id) {
        chrome.contextMenus.remove(_id, function () { });
    } else {
        chrome.contextMenus.removeAll(function () { });
    }
}

// Note : This implementation has to be here because the script has access to the chrome.* API
function setNextTrack() {
    console.log('Context menu listener set from app.js ');
}



/** @desc - Plays the next animation based on the next information to be logged . */
function PlayNextAnimation() {
    if (LogInformationList.length >= 1) {
        LogAnimationTimeElapsed = true;
        var nextLogInformation = LogInformationList.shift();
        $LogInfo(nextLogInformation.dataInfo, nextLogInformation.delay, nextLogInformation.ttl);
    } else { LogAnimationTimeElapsed = true; }
}

/** @desc- Reset stuff in the application to make sure its not having memory issues  */
app.AutoRefresh = function () {

}

/** @desc - Resets some declarations to make sure the app is free errors */
app.Refresh = function () {

}

/**
 * @desc - keeps the application useble incase of errors .
 * @todo - Use the log there to a file .
 */
app.onError = function (ErrorDet) {
    console.log('%c App Error [ ' + ErrorDet.type + ' ]' + ErrorDet, 'color:red; font-size:14px; font-weight:bold');
}

app.onInstalled = function () {
    console.info("App installed from [app.js]");
    // scanner.scan(); 
}

/** @returns {boolean}  - Whether the application is alread installed or not . */
app.installed = function () {
    // TODO: Checks if the application is installed .
    var appState = appStorage.read("installed");
    if (appState != undefined && appState.length >= 0) { 
        return true;
    } else {
        return false;
    }
}



/**
 * @desc -  App information logging
 * @param {string} - infomation to be logged
 * @param {Number} - Delay before notification is displayed
 * @param {Number} - Time to live for the log information
 */
var LogAnimation = function (dataInfo, delay, ttl) {
    if (dataInfo) {
        if (dataInfo.length > 50) dataInfo = dataInfo.substr(0, 50) + " ...";
        if ((delay > ttl || DefaultTTL) && typeof (ttl) == "number") { console.error("Error , the dalay cannot be more than the ttl value"); return; }
        if (!LogAnimationTimeElapsed) { LogInformationList.push({ dataInfo: dataInfo, delay: delay, ttl: ttl }); return; }

        $(".preloader-overlayGradient small").text(dataInfo);

        var lastLog = $("#info2").text();
        $("#info2").text("");
        lastInnerEle = document.createElement("span");
        lastInnerEle.innerHTML = lastLog;
        var currentInnerEle = document.createElement("span");
        currentInnerEle.innerHTML = dataInfo;
        currentInnerEle.setAttribute("class", "info2");
        LogAnimationTimeElapsed = false;

        ttl = (ttl) ? ttl : DefaultTTL;
        setTimeout(function () { PlayNextAnimation(); }, ttl);

        if (delay) {
            setTimeout(function () {
                $($(".info1")).remove();
                $($(".info2"))
                    .removeClass("info2")
                    .append(lastInnerEle)
                    .addClass("info1");
                $("#info").append(currentInnerEle);
                $($(".info1 span")).addClass("info_content");
            }, delay);
        } else {
            setTimeout(function () { PlayNextAnimation(); }, ttl);
            $($(".info1")).remove();
            $($(".info2"))
                  .removeClass("info2")
                  .append(lastInnerEle)
                  .addClass("info1");
            $("#info").append(currentInnerEle);
            $($(".info1 span")).addClass("info_content");
        }
    }
}


// TODO: Log to file after changing the application .
app.log = function (msgObj) {
    if (typeof msgObj == "object") {
        console.log(`Error:[${msgObj.type}]-${msgObj.code}-${msgObj.message}`);
    } else {
        console.log('Error:[' + msgObj + ']');
    }
}

/** @returns {String} - Music directory for any platfrom  */
app.PlatformIndexer = function () {
    var platform = navigator.appVersion;
    if (/\(.*\)/.exec(navigator.appVersion)[0].search(/Windows NT 10/i) >= 0) { // Windows 10
        return 1;
    } else {
        if (/\(.*\)/.exec(navigator.appVersion)[0] // Windows 7 && below
                .search(/(Windows 95)|(Win95)|(Windows_95)|(Windows 98)|(Win98)|(Windows NT 5.0)|(Windows 2000)|(Windows NT 5.1)|(Windows XP)|(Windows NT 5.2)/i) >= 0) {
            return 0;
        } else if (/Win16/i) {
            return 0;
        } else if (/\(.*\)/.exec(navigator.appVersion).search(/(Windows NT 6.0)|(Windows NT 6.1)|(Windows NT 6.2)|(WOW64)|/)) {
            return 0;
        } else {  // All linux based Os
            return 0;
        }
    }
},

app.setPlaybackModes = function () {
    var loopState = $('#RepeatToggle span').text() == 1;
    LoopOn = (loopState) ? "track" : false || ($RepeatToggle[0].attributes[1].value.search("RepeatToggle-On") >= 0);
    ShuffleOn = ($ShuffleToggle[0].attributes[1].value.search("ShuffleToggle-On") >= 0);
},


/**
 * @desc - app elements declarations
 * @todo - Implement persistent user settings .
 */
app.setup = function () {

    // open notification
    toggleNotification = true;
    $("#main-view").attr("class", "loading");
    $("#desktopFooterWrapper").attr("class", "loading");
    $(".preloaderWrap-closed").attr("class", "preloaderWrap-open");
    $(".preloader-closed").attr("class", "preloadep-open");

    rendered = false;
    meta = [];

    // InitialiseLayout();// Initilise react layout .

    console.log("%c Setup called !", "color: lime;");

    $playNob = $($.find("#play"));
    $previousNob = $($("#preTrack"));
    $nextNob = $($("#nextTrack"));
    $activeSong = $(".songTitle");
    $volCtrl = $("#volumeRange")[0],
    $LogInfo = LogAnimation;
    $volumeRange = $("#volumeRange");
    $staticFiles = $("#diskMusic");
    $searchBar = $(".searchBar");
    $searchBarIcon = $("#SearchToggle span:before");
    $SearchToggle = $("#SearchToggle");
    $RepeatToggle = $("#RepeatToggle");
    $ShuffleToggle = $("#ShuffleToggle");
    $EqualizerControl = $("#EqualizerControl");
    $VolumeControl = $("#VolumeControl");
    $MetaLog = $(".metalog");
    $cHrs = $("#timeLeft hrs");
    $cMins = $("#timeLeft mins");
    $cSecs = $("#timeLeft secs");
    $dHrs = $("#SongDuration hrs");
    $dMins = $("#SongDuration mins");
    $dSecs = $("#SongDuration secs");
    $closeBtn = $("#Close");
    $minimizeBtn = $("#Minimize");
    // Sound Effects
    $noiseReduction = $("#noiseReduction");
    $crossFade = $("#crossFade");
    $equalize = $("#equalize");
    $musicTab = $("div.left-side ul li:nth-child(1)");
    $playlistTab = $("div.left-side ul li:nth-child(2)");
    $onlineTab = $("div.left-side ul li:nth-child(3)");
    $syncTab = $("div.left-side ul li:nth-child(4)");
    $hoverSlide = $(".hoverSlide");
    $videoPlayer = $("#videPlayer")[0];

    $searchBar.val("	");

    // Test variables
    $inputIndex = $('#inputIndex');


}

onload = app.setup();
