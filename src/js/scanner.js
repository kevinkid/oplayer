
var fs = require('fs');
var FileAPI = require('file-api');
var File = FileAPI.File;
var FileList = FileAPI.FileList;
var FileReader = FileAPI.FileReader;
var mediaLibrary = require('media-library');
var isWin = process.env.HOME? false: true;
var basePath = process.env.USERPROFILE || process.env.HOME;

// static 
var meta = [],
    newMeta = [],
    dir = [],
    fileArray = [],
    loadProgressInterval,
    fileLoadCheckerInterval,
    displayTrackInterval,
    metaCount = 0,
    ignoredTracks = 0,
    fetchMeta,
    SongNum = 0;

var scanner = {};
var supportedAudioAndVideoFormats = 
["wave","webm","ogg","mp3","aac","mkv","wma","aiff","vlc","vob","webm","ogg","mp4","mkv","vob"];

function resetScanner() {
    fileArray = [];
    metaCount = 0;
    dir = [];
    newMeta = [];
}
// rendered tracks 
var renderedTracks = Function('return $(".songTitle").length');

/**
 * @description Set event listeners
 */ 
function SetEventHandlers() {
    handlers.setSingleTrackListeners();
}

function setCustomScrollbar() {
    handlers.setCustomScrollbar();
}

function displayScanProgress(title) {
    $(".preloader-overlayGradient small").text(title.trimEntity(30));
}

function displayReadCount() {
    $("span.info2").text("Loading files ... " + (readProgress()) + "%");
    $(".preloader-overlayGradient small").text("Loading files ... " + (readProgress()) + "%");
}

function readProgress() {
    return parseFloat(((renderedTracks() - 1) / (meta.length - 1) * 100).toFixed(0));
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
 * @description Trim music details before display
 */
function trimTitle(meta) {
    var duration = "";
    var metaObj = meta;
    var title = metaObj.title.trimEntity(45);
    var album = metaObj.album.trimEntity(17);
    var artist = metaObj.artist.trimEntity(17);

    if (metaObj.duration != null || metaObj.duration != undefined) {
        if (metaObj.duration.hours > 0) {
            duration += metaObj.duration.hours + ":" + metaObj.duration.minutes + ":" + metaObj.duration.seconds;
        } else {
            duration += metaObj.duration.minutes + ":" + metaObj.duration.seconds;
        }
    } else { duration = "0:00"; }
    return {
        title: title,
        artist: artist,
        album: album,
        year: metaObj.year,
        duration: duration,
        index: metaObj.index
    };
}


/** 
 * @description DOM inject with track info
 * @param {object} index track meta index
 */
function displayTrackList(args) {
    if (metaCount+1 < meta.length - 1) {
        var MusicInfo = trimTitle(meta[metaCount]);
        var fullInfo = meta[metaCount];
        args === undefined ? null : MusicInfo.title = " " ;
        $("tbody").append(
            '<tr row-index="' + SongNum + '" style="position: relative; padding-top: 40px;" id="wlistLinklist1_1" class="">' +
                '<td id="wlistLinklist1_1_1" data-count="' + SongNum + '" data-index="' + MusicInfo.index + '" class="colOne">' + SongNum + '</td>' +
                '<td id="wlistLinklist1_1_0" colspan="2" class="colTwo">' +
                    '<a class="songTitle" data-trackIndex="' + MusicInfo.index + '" style="text-ecoration: none;" title="' + (fullInfo.title) + '">' + MusicInfo.title + '</a></td>' +
                '<td class="songArtist" id="wlistLinklist1_1_1" class="colThree" title="' + fullInfo.artist + '">' + MusicInfo.artist + '</td>' +
                '<td class="songAlbum" id="wlistLinklist1_1_commands" class="colFour" title="' + fullInfo.album + '">' + MusicInfo.album + '</td>' +
                '<td id="wlistLinklist1_1_1" class="colFive">' +
                    '<span id="min">' + MusicInfo.duration + '</span>' +
                '</td>' +
            '</tr>');
        args === undefined ? Function('metaCount++;SongNum++')() : null;            
    }
}

/**
 * @description add new media files
 * @param {array} newMeta metadata
 */
function addMeta(newMeta) {
    newMeta.forEach(el => meta.push(el));
}

/**
 * @description check when the files are fully loaded 
 */
function filesLoaded() {
    if (renderedTracks() === (meta.length - 1)) {
        $LogInfo("all done, Enjoy ! ", 0, null);
        clearInterval(loadProgressInterval);
        clearInterval(displayTrackInterval);
        clearInterval(fileLoadCheckerInterval);
        setCustomScrollbar();
        SetEventHandlers();
        resetScanner();
        this.ready = true;
    }
}

function renderTrackList() {
    fileLoadCheckerInterval = setInterval(filesLoaded, 500);
    loadProgressInterval = setInterval(displayReadCount, 50);
    displayTrackInterval = setInterval(displayTrackList, 100);
}

/**
 * @description add media files
 */
function addGalleryMedia() {
    meta = fileArray; SongNum++;
    displayTrackList(null);
    handlers.crazyTabSwitch();
    handlers.hidePreloader();
    appStore.setMeta(meta);    
    renderTrackList();
}

/**
 * @param {object} files media files
 */
function onScanFinish(files) {
    if (files.length > 0) {
        var durationInterval = setInterval(getDuration, 10);
        var i = 0,
            j = 0,
            t = 0,
            x = 0,
            M = 0,
            T = 5000;
        function getDuration() {
            if (i === j || j === 0) {
                if (!(i + 1 > files.length - 1)) {
                    j =++ j;
                    M = files[i];
                    M.index = i;
                    var f = new File(M.path);
                    MetaHelper.getDurationFromBin(f, M, (metadata) => {
                        if (i != j) {
                            metadata.index  = i - t;
                            fileArray.push(metadata);
                            displayScanProgress(metadata.title);
                            i =++ i;                            
                        }
                    })
                } else {
                    ignoredTracks = t;
                    clearInterval(durationInterval);
                    addGalleryMedia(fileArray, files || []);
                }
            } else {
                if (x < 1) {
                    x =++ x;
                    setTimeout(a => {
                        x = 0;
                        if (i < j) {
                            i =++ i;
                            t =++ t;                            
                        }
                    }, T);
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

scanner.addGallery = function () {}
scanner.updateGallery = function () {}

function buildPath(base, gallery) {
    base = base.replace('\\','\/');
    return `${base}\/${gallery}`;
}

/**
 * @returns {array} media files paths
 */
function mediaDirectories() {
    var paths = [];
    var galleries = [ 'music', 'videos', 'pictures' ];
    galleries.forEach(gallery => paths.push(buildPath(basePath, gallery)));
    return paths;
}

/**
 * @description Scan disk for media files
 */
function scanMusicGallery() {
    var musicGalleryPath = mediaDirectories()[0];
    fs.readdir(musicGalleryPath, (err, files) => {
        if (!err) {
            if (files.length > 0) {
                var library = new mediaLibrary({
                    paths: [musicGalleryPath]
                });
                library.scan()
                .on('track', (track) => {
                    track.name =  track.path.replacePath()
                    track.stackSize = 0;
                    Promise.resolve(track);
                })
                .on('done', (all) => {
                    onScanFinish(all);
                })
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
function setMeta(data) {
    meta = data; SongNum++;
    displayTrackList(null);
    handlers.crazyTabSwitch();
    handlers.hidePreloader();
}

scanner.updateMeta = function (data) {
    appStore.updateMeta();
}

/**
 * @description initialize disk scan
 */
scanner.scan = function () {
    app.wasInstalled().then((metadata) => {
        console.log('update scan');
        setMeta(metadata);
        renderTrackList();
    }).catch((er) => {
        if (er) {
            console.log('initial scan');
            console.error(er);
            resetScanner();
            scanMusicGallery();
        }
    })
}
