/**
 * @description - Find and store music FileEntries
 */

var fs = require('fs');
var FileAPI = require('file-api');
var File = FileAPI.File;
var FileList = FileAPI.FileList;
var FileReader = FileAPI.FileReader;
var mediaLibrary = require('media-library');
var isWin = process.env.HOME? false: true;
 

var localGalleryOrigin = [],
    meta = [],
    newMeta = [],
    dir = [],
    dirGalleryList = [],
    readPromiseQueue = [],
    mGalleriesReader = null,
    nestReader = null,
    orgCounter = 0,
    fileArray = [],
    dirEntries = [],
    readyChecker,
    loadProgressInterval,
    fileLoadCheckerInterval,
    displayTrackInterval,
    RPCount = 0,
    metaCount = 0,
    ignoredTracks = 0,
    ReadPromiseCountLimit = 25,
    fetchMeta,
    SongNum = 0,
    mem = 0,
    idx = 0,
    readBreakOn = false;
var scanner = {
    onFinishedScan: undefined

};

/**
 * @desc: commpression support and different audio/video formats are indicated below .
 * @note: supported commpresssion Vorbis,Opus<audio> vp8,vp9<video>
 */
var audioFormatsSupported = {
    ".wave": "wave format",
    ".webm": "webm format",
    ".ogg": "ogg format",
    ".mp3": "mp3 format",
    ".aac": "aac format",
    ".mkv": "mkv format",
    ".wma": "wma format",
    ".aiff": "aiff  format",
    ".vlc": "vlc format",
    ".vob": "vob format"
};
var videoFormatsSupported = {
    ".webm": "webm format",
    ".ogg": "webm format",
    ".mp4": "mp4 format",
    ".mkv": "mkv format",
    ".vob": "vob format"
};


function GalleryData(id) {
    this._id = id;
    this.path = "";
    this.sizeBytes = 0;
    this.numFiles = 0;
    this.numDirs = 0;
}

function resetScanner() {
    fileArray = [];
    idx = 0;
    metaCount = 0;
    dir = [];
    newMeta = [];
    mGalleriesReader = null;
    nestReader = null;
    orgCounter = 0;
    RPCount = 0;
    localGalleryOrigin = null;
}

/**
 * @description Set event listeners
 */ 
function SetEventHandlers() {
    this.eventHandler.setSingleTrackListeners();
}


function setCustomScrollbar() {
    this.eventHandler.setCustomScrollbar();
}

function displayReadCount() {
    $("span.info2").text("Loading files ... " + (readProgress()) + "%");
    $(".preloader-overlayGradient small").text("Loading files ... " + (readProgress()) + "%");
}

function readProgress() {
    return parseFloat((parseFloat(($(".songTitle").length-1) / (meta.length - 1)*100)).toFixed(0));
}

/** 
 * @description DOM inject with track info
 * @param {object} MusicInfo meta object
 */
function displayTrackList(MusicInfo) {
    if (MusicInfo) {
        var fullInfo = meta[MusicInfo.index];
        SongNum += 1;
        $("tbody").append(
            '<tr row-index="' + SongNum + '" style="position: relative; padding-top: 40px;" id="wlistLinklist1_1" class="">' +
                '<td id="wlistLinklist1_1_1" data-count="' + SongNum + '" data-index="' + MusicInfo.index + '" class="colOne">' + SongNum + '</td>' +
                '<td id="wlistLinklist1_1_0" colspan="2" class="colTwo">' +
                    '<a class="songTitle" data-trackIndex="' + MusicInfo.index + '" style="text-ecoration: none;" title="' + (fullInfo.title) + '">' + MusicInfo.songTitle + '</a></td>' +
                '<td class="songArtist" id="wlistLinklist1_1_1" class="colThree" title="' + (fullInfo.artist) + '">' + MusicInfo.artist + '</td>' +
                '<td class="songAlbum" id="wlistLinklist1_1_commands" class="colFour" title="' + (fullInfo.album) + '">' + MusicInfo.album + '</td>' +
                '<td id="wlistLinklist1_1_1" class="colFive">' +
                    '<span id="min">' + MusicInfo.duration + '</span>' +
                '</td>' +
            '</tr>');
    } else {
        // if (ready) { return; }
        $("tbody").append(
            '<tr class="head" style="position: relative; opacity:0; padding-top: 40px;" id="wlistLinklist1_1 width:100px;" class="">' +
                '<td id="wlistLinklist1_1_1"  class="colOne" data-playback="false"></td>' +
                '<td id="wlistLinklist1_1_0" colspan="2" class="colTwo">' +
                    '<a class="songTitle" data-trackIndex="2" style="text-decoration: none;">whole song title with some few more space to help with </a></td>' +
                '<td id="wlistLinklist1_1_1"  class="colThree">artist name</td>' +
                '<td id="wlistLinklist1_1_commands"  class="colFour">album name</td>' +
                '<td id="wlistLinklist1_1_1"  class="colFive">' +
                    '<span id="min">2:34</span>' +
                '</td>' +
            '</tr>');
    }
}

/**
 * @description Trim music details before display
 */
function trimTitle(meta) {

    var duration = "";
    var metaObj = meta;

    var title = (metaObj.title.slice(0, 42) + ((metaObj.title.length>45)? "...":""));
    var artist = ((metaObj.artist || "").slice(0, 9) + ((metaObj.artist.length>12)? "...":""));
    var album = (metaObj.album.slice(0, 9) + ((metaObj.length>12)? "...":""));

    if (metaObj.duration != null || metaObj.duration != undefined) {
        if (metaObj.duration.hours > 0) {
            duration += metaObj.duration.hours + ":" + metaObj.duration.minutes + ":" + metaObj.duration.seconds;
        } else {
            duration += metaObj.duration.minutes + ":" + metaObj.duration.seconds;
        }
    } else { duration = "0:00"; }
    return {
        songTitle: title,
        artist: artist,
        album: album,
        year: metaObj.year,
        duration: duration,
        index: metaObj.index
    };
}

/**
 * add new media files metadata
 * @param {array} newMetadata metadata
 */
function addMeta(newMetadata) {
    newMeta.forEach(el => meta.push(el));
}

/**
 * @description check when the files are fully loaded 
 */
function filesLoaded() {
    if ($(".songTitle").length === (meta.length - ignoredTracks)) {
        SetEventHandlers();
        clearInterval(loadProgressInterval);
        clearInterval(displayTrackInterval);
        clearInterval(fileLoadCheckerInterval);
        resetScanner();
        this.ready = true;
        $LogInfo("all done, Enjoy ! ", 0, null);
    }
}


function renderTrackList() {
    fileLoadCheckerInterval = setInterval(filesLoaded, 500);
    loadProgressInterval = setInterval(displayReadCount, 50);
    displayTrackInterval = setInterval(function () {
        if (metaCount+1 < meta.length - 1) {
            displayTrackList(trimTitle(meta[metaCount]));
            metaCount++;
        }
    },100);
}

/**
 * @param {string} title track title
 */
function displayScanProgress(title) {
    title = (title.length > 30) ? title.slice(0, 30)+"...": title;
    $(".preloader-overlayGradient small").text(title);
}

/**
 * 
 * @description add media files
 */
function addGalleryMedia() {
    meta = fileArray;
    displayTrackList(undefined);
    // setCustomScrollbar();// TODO: Debug this custom scrollbar 
    eventHandler.hidePreloader();
    renderTrackList();
}


/**
 * @param {object} files media files
 */
function onScanFinish(files) {
    if (files.length > 0) {
        var durationInterval = setInterval(getDuration, 100);
        var i = 0,
            j = 0,
            t = 0,
            x = 0;
        function getDuration() {
            if (i === j + 1 || j === 0) {
                if (!(i + 1 > files.length - 1)) {
                    var file = new File(files[i].path);
                    j = i;
                    MetaHelper.getDurationFromBin(file, files[i], (metadata) => {
                        metadata.index  = i;
                        fileArray.push(metadata);
                        displayScanProgress(metadata.title);
                        i =++ i;
                    })
                } else {
                    ignoredTracks = t;
                    clearInterval(durationInterval);
                    addGalleryMedia(fileArray, files || []);
                }
            } else {
                if (x < 1) {
                    x =++ x;
                    t =++ t;
                    setTimeout(a => i =++ i, 5000);
                } else {
                    x =++ x;
                }
            }
        }
    } else {
        noMusicError()
    }
}

scanner.fetchUpdates = function () {
    var updates = [];
    scanner.scan();
    return updates;
}

scanner.addGallery = function (dir) {}
scanner.updateGallery = function (curG, newG) {}

function buildPath(base, gallery) {
    if (isWin) { //  TODO: What the hell is the difference .
        base = base.replace('\\','\/');        
        return `${base}\/${gallery}`;
    } else {
        base = base.replace('\\','\/');
        return `${base}\/${gallery}`;
    }
}

function mediaDirecties() {
    var basePath = process.env.USERPROFILE || process.env.HOME;
    var paths = [];
    var galleries = [ 'music', 'videos', 'pictures' ];
    galleries.forEach(gallery => paths.push(buildPath(basePath, gallery)));
    return paths;
}

function noMusicError() {
    resetScanner();    
    ready = true;
    $LogInfo("No media files found , make sure you have music is the music and video directories.", 0, null);   
}

function onScanError() {
    resetScanner();
    this.ready = true;
    $LogInfo("Error ! there was an problem reading the music directory , please check the log file.", 0, null);
}

/**
 * @description Scan disk for media files
 */
function scanMusicGallery() {
    var musicGalleryPath = mediaDirecties()[0];
    var index = 0;
    fs.readdir(musicGalleryPath,(err, files) => {
        if (!err) {
            // Empty directory 
            if (files.length > 0) {
                var library = new mediaLibrary({
                    paths: [musicGalleryPath]
                });
                library.scan()
                .on('track', (track) => {
                    track.name = track.path.replace(/.*\//.exec(track.path)[0],"");
                    track.stackSize = 0;
                    Promise.resolve(track);
                })
                .on('done', (all) => onScanFinish(all) );
            } else {
                noMusicError()
            }
        } else {
            onScanError()
        }
    })
}

/**
 * @description set metadata from storage
 */
function setMeta() {
    //  TODO: Store and read meta from persistent settings storage
    meta = [];
}

scanner.updateMeta = function (data) {
    appStore.updateMeta();
}

/**
 * @description initialize disk scan
 */
scanner.scan = function () {

    // app.wasInstalled().then(() => {
    // }).catch(() => {
    //     // initial scan
    // })

    if (false) {
         console.log('update scan');
         setMeta();
         renderTrackList();
    } else {
        console.log('initial scan');
        resetScanner();
        scanMusicGallery();
    }
}
