/**
 * @desc - Find and store music FileEntries
 */

 var fs = require('fs');

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
    displayTrackInterval,
    RPCount = 0,
    metaCount = 0,
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
var supportedAudioExt = {
    wave: "wave format",
    webm: "webm format",
    ogg: "ogg format",
    mp3: "mp3 format",
    aac: "aac format",
    mkv: "mkv format",
    wma: "wma format",
    aiff: "aiff  format",
    vlc: "vlc format",
    vob: "vob format"
};
var supportedVideoExt = {
    webm: "webm format",
    ogg: "webm format",
    mp4: "mp4 format",
    mkv: "mkv format",
    vob: "vob format"
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

// Set listeners
function SetEventHandlers() {
    if ($(".songTitle").length>0) {
        // NOTE: !IMPORTANT , I dont get it why removeing event listeners dont work .
        $(".songTitle")[0].removeEventListener("click", function () { });
        this.eventHandler.setSingleTrackListeners();
    }
}

// TODO: GET RID OF THIS CUSTOM SCOLL BAR .
function setCustomScrollbar() {
    this.eventHandler.setCustomScrollbar();
}

function displayReadCount() {
    $("span.info2").text("Loading files ... " + (readProgress()) + "%");
    $(".preloader-overlayGradient small").text("Loading files ... " + (readProgress()) + "%");
}

function readBreaks() {
    readBreakOn = readBreakOn ? false : true;
}

// @bug - inacurrate count .
function readProgress() {
    return parseFloat((parseFloat(($(".songTitle").length-1) / (localGalleryOrigin.length - 1)*100)).toFixed(0));
}

/** @desc - Injects the dom with new table row elements containing track info . */
function DisplayMusicMeta(MusicInfo) {
    if (MusicInfo) {
        SongNum += 1;
        $("tbody").append(
            '<tr row-index="' + SongNum + '" style="position: relative; padding-top: 40px;" id="wlistLinklist1_1" class="">' +
                '<td id="wlistLinklist1_1_1" data-count="' + SongNum + '" data-index="' + MusicInfo.trackIndex + '" class="colOne">' + SongNum + '</td>' +
                '<td id="wlistLinklist1_1_0" colspan="2" class="colTwo">' +
                    '<a class="songTitle" data-trackIndex="' + MusicInfo.trackIndex + '" style="text-ecoration: none;" title="' + MusicInfo.songTitle + '">' + MusicInfo.songTitle + '</a></td>' +
                '<td class="songArtist" id="wlistLinklist1_1_1" class="colThree" title="' + MusicInfo.artist + '">' + MusicInfo.artist + '</td>' +
                '<td class="songAlbum" id="wlistLinklist1_1_commands" class="colFour" title="' + MusicInfo.album + '">' + MusicInfo.album + '</td>' +
                '<td id="wlistLinklist1_1_1" class="colFive">' +
                    '<span id="min">' + MusicInfo.duration + '</span>' +
                '</td>' +
            '</tr>');
    } else {
        if (ready) { return; }
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

// NOTE: Dublicates are posible due to inacurate callback promises.
function IsGetMetaDublicate(title) {
    var dublicate = false;
    if (meta.length > 0) {
        for (var i = 0; i < meta.length; i++) {
            if (meta[i].name == title) {
                return true;
            } else {
                dublicate = false;
            }
        }
    }
    return dublicate;
}

function IsReadDublicate(fileName) {
    var dublicate = false;
    readPromiseQueue.map(function (index, fileEle, array) {
        if (fileName.search(fileEle.name)>=0) {
            return true;
        }
    });
    return dublicate;
}

function IsDisplayDublicate(title) {
    var dublicate = false;
    $(".songTitle").map(function (index, DomEl) {
       if (DomEl.innerText == title){
           dublicate = true;
           return true;
       }
    });
    return dublicate;
}

/**
 * @bug - Meta is getting sliced before we can store it eg. title...
 */
function trimTitle(meta) {
    var duration = "";
    var metaObj = meta;
    metaObj.title = (metaObj.title.slice(0, 42) + ((metaObj.title.length>45)? "...":""));
    metaObj.artist = (metaObj.artist.slice(0, 9) + ((metaObj.artist.length>12)? "...":""));
    metaObj.album =  (metaObj.album.slice(0, 9) + ((metaObj.length>12)? "...":""));
    if (metaObj.duration != null || metaObj.duration != undefined) {
        if (metaObj.duration.hours > 0) {
            duration += metaObj.duration.hours + ":" + metaObj.duration.minutes + ":" + metaObj.duration.seconds;
        } else {
            duration += metaObj.duration.minutes + ":" + metaObj.duration.seconds;
        }
    } else { duration = "0:00"; }
    return {
        songTitle: metaObj.title,
        artist: metaObj.artist,
        album: metaObj.album,
        year: metaObj.year,
        duration: duration,
        trackIndex: metaObj.index
    };
}

/** @desc - match the track title to the track index . */
function songIndexer(title) {
    var index;
    localGalleryOrigin.forEach(function (el, _idx) {
        if (el.name == title) { index = _idx; }
    });
    return index;
}

function addMeta(_newMeta) {
    newMeta = _newMeta ||  newMeta;
    newMeta.forEach(el => meta.push(el));
}

function fileLoadChecker() {
    if (($(".songTitle").length) > (localGalleryOrigin.length-3)) { //  NOTE: Load Accuracy
        SetEventHandlers();
        clearInterval(readyChecker);
        clearInterval(loadProgressInterval);
        clearInterval(readBreakInterval);
        clearInterval(displayTrackInterval);
        clearInterval(getMetaChecker);
        clearInterval(fetchMeta);
        chrome.app.window.current().restore();
        eventHandler.hidePreloader();
        appStorage.store(meta);
        resetScanner();
        this.ready = true;
        $LogInfo("all done, Enjoy ! ", 0, null);
    }
}

function renderTrackList() {
    loadProgressInterval = setInterval(displayReadCount, 50);
    displayTrackInterval = setInterval(function () {
        if (metaCount+1 < meta.length - 1) {
            if (!IsDisplayDublicate(meta[metaCount].title)) {
                DisplayMusicMeta(trimTitle(meta[metaCount]));
            }
            metaCount++;
        }
    },100);
}


function resolveGetMetaChecker () {
    if (metaCount > localGalleryOrigin.length-3) { //  NOTE: Load Accuracy
        metaCount = 0;
        renderTrackList();
    }
}

function displayMetaProgress(title) {
    title = MetaHelper.parseFileName(title);
    title = title.slice(0, 30)+"...";
    $(".preloader-overlayGradient small").text("Adding files [ " + (title) + " ]");
}


/** @return {Object} - File meta  */
function GetMetaPromise(file) {
    MetaHelper.retrieveMeta(file, function (_MetaObj) {
        if (!IsGetMetaDublicate(_MetaObj.title)) {
            var index = songIndexer(file.name);
            RPCount -= 1;
            metaCount++;
            _MetaObj.index = metaCount - 1;
            _MetaObj.source = file;
            if (!ready) {
                displayMetaProgress(_MetaObj.title);
                meta.push(_MetaObj);
            } else {
                displayMetaProgress(_MetaObj.title);
                newMeta.push(_MetaObj);
            }
        }
    });
}

function ReadDisk() {
    if (!readBreakOn) {
        if (RPCount < ReadPromiseCountLimit) {
            if (idx < fileArray.length - 1) {
                if (RPCount != 0 && RPCount > 1 && RPCount < 3) { console.log('Read resolved ... '); }
                try {
                    RPCount += 1;
                    fileArray[idx].file(function (result) {
                        if (!IsReadDublicate(result.name)) {
                            appStorage.store({installed: true});
                            readPromiseQueue.push(result.name);
                            GetMetaPromise(result, idx);
                        }
                    });
                } catch (e) {
                    console.error('Error reading file  [ReadDisk] make sure the permissions are set to read ');
                    return;
                }
                idx++;
            }
        }
    }
}

/** @desc - Get media files meta and display */
function ReadMeta() {

    RPCount = 0;// NOTE: Check why we have to reinitialise these again .
    ReadPromiseCountLimit = 25;
    SongNum = 0;
    readBreakOn = false;
    idx = 0;
    metaCount = 0;

    setCustomScrollbar();
    DisplayMusicMeta(undefined);
    $LogInfo("Retrieving meta ...", 0, null);
    readyChecker = setInterval(fileLoadChecker, 500);
    fetchMeta = setInterval(function () { ReadDisk() }, 100);// NOTE: Make sure fetching meta is not too agresive because of the memory .
    readBreakInterval = setInterval(readBreaks, 15000); // [ms]
    getMetaChecker = setInterval(resolveGetMetaChecker,2000);

}

function removeDublicatedmediaFiles() {

}

function addGalleryMedia(oldGallery, newGallery) {
    if (localGalleryOrigin.length > 1) {
        oldGallery.forEach(el => localGalleryOrigin.push(el));
    } else {
        localGalleryOrigin = oldGallery;
    }
}


// @bug This filter does not work for some reason .
function dublicateFilter(oldList, newList) {
    oldList.map(function (value, index, array) {
        if (newList.findIndex(arEl => arEl.name == value.name) <= 0) {
            newList.push(value);
        }
    });
    fileArray = newList;
}

// NOTE: Tip ! -> Tell the users to more files like vidoes to the music folder without the directories that they are in.
// TODO: Better handle fetching music files .

function supportFilter() {
    // supportedAudioExt =  supportedAudioExt;// NOTE: Check why this has to be reinitialised again . !important context
    // supportedVideoExt =  supportedVideoExt;
    if (fileArray.length > 0) {
        fileArray = fileArray.filter(
          fileExt => supportedAudioExt.hasOwnProperty(/[.](.*)$/g.exec(fileExt.name.toLocaleLowerCase())[this.length + 1]) ||
                    supportedVideoExt.hasOwnProperty(/[.](.*)$/g.exec(fileExt.name.toLocaleLowerCase())[this.length + 1]));
                dublicateFilter(fileArray, []);
            addGalleryMedia(fileArray, []);
        ReadMeta();
    } else {
        ready = true;
        eventHandler.hidePreloader();
        $LogInfo("No media files found in the music and video directory.", 0, null);
    }
}

scanner.fetchUpdates = function () {
    var updates = [];
    // TODO: scanner.scan(app.PlatformIndexer());
    return updates;
}

scanner.updateGallery = function (oldG, newG) {
    if (oldG && newG) {
        // NOTE: You have to check the ones that are removed and remove from the old gallery
        //        and add the added tracks that are added at the old gallery .
    }
}


// Log scan error messages
function LogErrors(er) {
    console.error(er);
}

// TODO: Adding files that are in the other storage devices.
function onGalleryWatchAdded(galleryInfo) {
    var sampleGalleryInfo = {
        galleryId: "2",
        success: false
    };
}

scanner.scanGallery =  scanGallery;

/** @src - Google chromuim app code samples .  */
function scanGallery(entries) {
    if (entries.length == 0) {
        if (dir.length > 0) {
            var nestedDir = dir.shift();
            console.log("Doing dir => "+nestedDir.name);
            nestReader = nestedDir.createReader();
            nestReader.readEntries(scanGallery, LogErrors('readEntries'));
        }
        else {
            idx++;
            if (idx > dirEntries.length - 1) {
                if (localGalleryOrigin.length == 0) { fileArray = fileArray.slice(5, fileArray.length); }
                setTimeout(function() { supportFilter(); }, 2000);
            } else {
                console.log('Doing next Gallery: ' + dirEntries[idx].name);
                scanGalleries(dirEntries[idx]);
            }
        }
        return;
    }
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].isFile) {
            fileArray.push(entries[i]);
        }
        else if (entries[i].isDirectory) {
            dir.push(entries[i]);
        }
        else {
            console.log("Unsupported documents.");
        }
    }
    nestReader.readEntries(scanGallery, LogErrors);
}

scanner.scanGalleries = scanGalleries;

function buildPath(base, gallery) {
    base = base.replace('\\','\/');
    return `${base}\/${gallery}`;
}

function mediaDirecties() {
    var basePath = process.env.USERPROFILE;
    var paths = [];
    var galleries = [ 'music', 'videos', 'pictures' ];
    galleries.forEach(gallery => paths.push(buildPath(basePath, gallery)));
    return paths;
}

function scanGalleries() {
    var musicGalleryPath = mediaDirecties()[0];
    fs.readdir(musicGalleryPath,(err, files) => {
        if (!err) {
            console.log('PATHS');
            console.dir(files);
            if (files.length>0) {
                var filesReadCount = 0;
                files.forEach(file => {
                    var filePath = musicGalleryPath+'\/'+file;
                    fs.readFile(filePath, (errs, mediaFile) =>{
                        if (!errs) {
                            filesReadCount++;
                            console.log('%s files read', filesReadCount);
                            console.log(mediaFile.name);
                        } else console.error(errs);
                    })
                })

                // TODO: Read all meta and remove preloader .
                SetEventHandlers();
                clearInterval(readyChecker);
                clearInterval(loadProgressInterval);
                // clearInterval(readBreakInterval);
                // clearInterval(displayTrackInterval);
                // clearInterval(getMetaChecker);
                // clearInterval(fetchMeta);
                // chrome.app.window.current().restore();
                eventHandler.hidePreloader();
                this.eventHandler.setSingleTrackListeners();
                // appStorage.store(meta);
                resetScanner();
                this.ready = true;
                $LogInfo("all done, Enjoy ! ", 0, null);
            }
        }
    });
}

// function scanGalleries(fs) {
//     var mData = chrome.mediaGalleries.getMediaFileSystemMetadata(fs);
//     if (mData.name.search(/Pictures|Downloads|Picasa|iTunes|Movies/i) >= 0) {
//         idx++;
//         if (idx > dirEntries.length - 1) {
//             if (localGalleryOrigin.length == 0) { fileArray = fileArray.slice(5, fileArray.length); }
//             supportFilter();
//         } else {
//             scanGalleries(dirEntries[idx]);
//         }
//     } else {
//         console.log('Reading gallery: ' + mData.name);
//         dirEntries[idx] = new GalleryData(mData.galleryId);
//         nestReader = fs.root.createReader();
//         nestReader.readEntries(scanGallery, LogErrors);
//         chrome.mediaGalleries.addGalleryWatch(mData.galleryId, onGalleryWatchAdded);
//     }
// }

// Initial Scan
scanner.scan = function () {
    if (true) { // app.installed()
         // TODO: Read from the storage instead then update .
         scanGalleries();
    } else { 
        console.log("Autoload media galleries !!!");
        console.log("Loading ...");
        chrome.mediaGalleries.getMediaFileSystems({
            interactive: "if_needed"
        }, function (galleryFsList) {
            idx = 0;
            console.log("Total galleryFs");
            console.dir(galleryFsList);
            dirGalleryList = galleryFsList;
            dirEntries = galleryFsList;
    
            scanGalleries(dirEntries[0]);
        });
    }
}
