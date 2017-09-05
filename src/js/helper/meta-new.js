// AUTHOR: bigkevzs
(function() {
  'use strict';

/**
 * @desc - Gets the metadata for a specified file
 * @todo - Read the album artwork and put inside a html image element .
 * @todo - This implementation reads the file twice .
 */
self.MetaHelper = function (){};

/**
 * @todo - Before you understand how the encoder works , learn about the difference between a string literal and a character .
 * Note : The Binary to encoded string converter uses the binary
 *         Stored inside the raw binary in different places as part
 *          of the binary .
 * Note : This code was submited by mozila , go look for the code to understand it better .
 */
function encodeImg (_bin) {
    // Encoder base string characters .
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwqyz0123456789+/=";
    var output = "";
    var bytebuffer;
    var encodedCharIndexs = new Array();
    var inx = 0;
    var paddingBytes = 0;

    while (inx < _bin.length) {

        bytebuffer = new Array();

        for (jnx = 0; jnx < bytebuffer.length; jnx++) {
            if (inx < _bin.length) {
                bytebuffer[jnx] = _bin.charCodeAt(inx++) & 0xff; // Throw away why i don't know whay .
            } else {
                bytebuffer[jnx] = 0;
            }

            // Get the encoded character, 6 bits at a time
            // index 1: first 6 bits
            encodedCharIndexs[0] = bytebuffer[0] >> 2;
            // index : 2 second 6 bits (2 least significant bits from input byte 1 +4 most significant bits from byte 2)
            encodedCharIndexs[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
            // index : 3 third 6 bits (4 least significant bits from input byte 3 + 2 most significant bits from byt 3)
            encodedCharIndexs[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
            // index : 4 forth 6 bits  (6 least significant bits from input 6)
            encodedCharIndexs[3] = bytebuffer[2] & 0x3f;

            // Determine whether padding happened and adjust accordingly
            paddingBytes = inx - (_bin.length - 1);

            switch (paddingBytes) {
                case 2:
                    encodedCharIndexs[3] = 64;
                    encodedCharIndexs[2] = 64;
                break;
                case 1:
                        encodedCharIndexs[3] = 64;
                break;
                default:
                    break;
            }

            // Note we will grab each appropriate character out of out keystring
            // based on our index array and append it to the output string
            for (jnx = 0; jnx <  encodedCharIndexs.length;  jnx++)
            {
                output += _keyStr.charAt(encodedCharIndexs[jnx]);
            }
            return output;
        }

        return output;

    } // while loop
}



// Note : REMOVE IF IT DOES NOT WORK .
function encodeImageUri(rawBin) {
     return btoa(encodeURIComponent(rawBin).replace("/%([0-9A-F]{2})/g", function (match, p1){
         return String.fromCharCode("0x"+p1);
     }));
}

/** @return {Object} - HTMLDomImageElement */
function createAlbumArtwork(bin) {

    function hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    var imageEle = document.createElement("img");
    imageEle.setAttribute("class","metaImg");
    imageEle.width = 100;
    imageEle.height = 100;

    /*-------------------------------------------------
          sure way

    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    context.drawImage(b,0,0);
    imageEle.src =  context.getImageData();
    -------------------------------------------------*/

    //"data:image/jpeg;base64,/9j/4QA...AAAAP/2Q==";

    var source = hexToBase64(bin);
    source = 'data:image/png;base64,'+source;

    //imageEle.src = "data:image/jpeg;base64,"+btoa(bin); // Note : Try putting both of them together.
    //imageEle.src =  "data:image/jpeg;base64,"+URL.createObjectURL(btoa(bin)); // index 143 is a jpeg format .
    //imageEle.src = URL.createObjectURL(new Blob(new Uint8Array(btoa(bin)), {type : 'image/*'})); // index 143 is a jpeg format .
    //imageEle.src =  "data:image/jpeg;base64,"+URL.createObjectURL(btoa(bin)); // index 143 duaughtry crawling back to you  is a jpeg format .


    // NOTE: This works but using the reader is expensive.
    var i, l, d, array;// this assumes that the array is rr
    d = bin;
    l = d.length;
    array = new Uint8Array(l);
    for (var i = 0; i < l; i++) {
        array[i] = d.charCodeAt(i);
    }

    // TODO: Check if you can create a file/blob using the raw binary .
    var b = new Blob([array], {type: 'image/jpeg'});
    console.dir(b);

    // NOTE: Don't create object url if you read the blob as a dataurl.
    var reader = new FileReader();
    reader.onload = function($) {
        imageEle.src = e.target.result;
        return imageEle;
    }
    reader.readAsDataURL(b);

}


/**
 * @desc - displaying the meta and setting the meta image artwork for a track .
 */
function pertialDisplay(meta, element) {

    // clear
    $MetaLog.text("");

    for(var key in meta){
        if (key == "image") {

            meta.image = meta[key];
            imageEle.src  = createAlbumArtwork(meta[key]);
            $MetaLog.append(imageEle);
            meta.artwork = imageEle;

         } else {
            var newChild = document.createElement("div");
            newChild.setAttribute("class","metaItem");
            newChild = $(newChild);
            newChild.text(key+" : "+meta[key]);
            $MetaLog.append(newChild);
         }
    }
}



/**
 * @return {String} - Base64 URL string intepretation of raw binary
 */
function readBuffer (bin) {
    var mediaReader = new FileReader();

    mediaReader.onload = function (eve) {
        console.log(eve);
        var data = btoa(eve.target.result);	// convert to base64 binary
        objectUrl = URL.createObjectURL(data);
        return eve.target.result;
    }

  	mediaReader.readAsDataURL(bin);
}

MetaHelper.__proto__.createImageArtwork = function (bin) {
  if (bin) {
    console.log('%c Album artwork','color:pink');
    // createAlbumArtwork(bin);
  } else {
    return null;
  }
}


MetaHelper.__proto__.parseFileName = function (name) {
  if(name.search(/(.mp3)/m) >= 0) {
    return name.replace(/(.mp3)$/m.exec(name)[0],"");
  } else {
    return name.replace(/(.mp4)$/m.exec(name)[0],"");
  }
},


/**
 * @desc - Calculates duration from file entry.
 * @todo - use the javascript in your jsfiddle to get duration before implementing all your own .
 * @param {Object} - blob object
 * @return {Object} - time object
 */
MetaHelper.__proto__.getDurationFromBin = function (file,meta,callback) {
      console.dir("audio tag");
      try {

        // NOTE: Called every time the source changes make sure that is the case .
        var audioTag = document.createElement('audio');
        audioTag.addEventListener("canplaythrough", function (ev) {
           debugger;
           // TODO: Reduce the number of calls
           var time = ev.currentTarget.duration; // [ms]

           callback({
               stackCount: meta.stackCount+1,
               artwork: MetaHelper.createImageArtwork(meta.image) || null,
               duration : {
                             full : MetaParser.durationConverter(time,'full'),
                             hours : MetaParser.durationConverter(time,'hours'),
                             minutes : MetaParser.durationConverter(time,'minutes'),
                             seconds : MetaParser.durationConverter(time,'seconds')
                           }
           });
        });
        audioTag.src = URL.createObjectURL(file);// dont't make sence to use the event because we are avoid using the reader .

      } catch (_ex) {
        debugger;
        callback({
          stackCount: meta.stackCount+1,
          artwork: null,
          duration : null,
        })
      }
}



/**
 * @param {Number} - raw seconds
 * @param {String} - output time
 */
MetaHelper.__proto__.durationConverter = function (iT,oT) {
    switch (oT) {
        case "full" :
          return (Math.floor(Math.floor(iT)/36e2)+":"+((Math.floor(iT/60)) )>9?(Math.floor(iT/60)):
                ("0"+(Math.floor(iT/60)))+":"+(Math.floor(Math.floor(iT - Math.floor(iT/ 60) * 60))));
        break;
        case "hours":
          return Math.floor(iT/36e2)>9?Math.floor(iT/36e2):"0"+Math.floor(iT/36e2);
        break;
        case "minutes":
            return Math.floor(iT/60)>9?Math.floor(iT/60):"0"+Math.floor(iT/60);
        break;
        case "seconds":
            return Math.floor(iT - Math.floor(iT/ 60) * 60)>9?Math.floor(iT - Math.floor(iT/ 60) * 60):
                            "0"+Math.floor(iT - Math.floor(iT/ 60) * 60);
        break;
    }
}


/**
 * @returns {String} - A human version of the framename
 * @todo - embed the frames object in this method after your done with the lib, minimize the space .
 */
function HumanizeFrame(framename) {
    if(framename){
        return ({
                    TAL: "album", TBP: "bpm", TCM: "composer", TCO: "genre", TCR: "copyright",
                    TDY: "playlist-delay", TEN: "encoder", TFT: "file-type", TKE: "initial-key", TLA: "language",
                    TLE: "length", TMT: "media-type", TOA: "original-artist", TOF: "original-filename", TOL: "original-writer",
                    TOT: "original-album", TP1: "artist", TP2: "band", TP3: "conductor", TP4: "remixer",
                    TPA: "set-part", TPB: "publisher", TRC: "isrc", TRK: "track", TSS: "encoder-settings",
                    TT1: "content-group", TT2: "title", TT3: "subtitle", TXT: "writer", WCOM: "url-commercial",
                    WCOP: "url-legal", WOAF: "url-file", WOAR: "url-artist", WOAS: "url-source", WORS: "url-radio",
                    WPAY: "url-payment", WPUB: "url-publisher", WAF: "url-file", WAR: "url-artist", WAS: "url-source",
                    WCM: "url-commercial", WCP: "url-copyright", WPB: "url-publisher", COMM: "comments", APIC: "image",
                    PIC: "image", TALB: "album", TBPM: "bpm", TCOM: "composer", TCON: "genre",
                    TCOP: "copyright", TDEN: "encoding-time", TDLY: "playlist-delay", TDOR: "original-release-time", TDRC: "recording-time",
                    TDRL: "release-time", TDTG: "tagging-time", TENC: "encoder", TEXT: "writer", TFLT: "file-type",
                    TIPL: "involved-people",TIT1: "content-group",TIT2: "title",TIT3: "subtitle",TKEY: "initial-key",
                    TLAN: "language", TLEN: "length", TMCL: "credits", TMED: "media-type", TMOO: "mood",
                    TOAL: "original-album", TOFN: "original-filename", TOLY: "original-writer", TOPE: "original-artist", TOWN: "owner",
                    TPE1: "artist", TPE2: "band", TPE3: "conductor", TPE4: "remixer", TPOS: "set-part",
                    TPRO: "produced-notice", TPUB: "publisher", TRCK: "track", TRSN: "radio-name", TRSO: "radio-owner",
                    TSOA: "album-sort", TSOP: "performer-sort", TSOT: "title-sort", TSRC: "isrc", TSSE: "encoder-settings",TSST: "set-subtitle"
                })[framename] || false;
    }
}



/*
    Note : DataView custom properties
    Todo : Put this as part of code or not .
=============================================*/


// getchar dataview custom property
DataView.prototype.getChar=function(start) {
    return String.fromCharCode(this.getUint8(start));
};
// getstring dataview custom property
DataView.prototype.getString=function(start,length) {
    for(var i=0,v='';i<length;++i) {
        v+=this.getChar(start+i);
    }
    return v;
};
// getint dataview custom property
DataView.prototype.getInt=function(start) {
    return (this.getUint8(start) << 21) | (this.getUint8(start+1) << 14) | (this.getUint8(start+2) << 7) | this.getUint8(start+3);
};

/**
 * @desc - trims a string to retrieve a piece of text .
 */
function parseTextField(buffer, pos, size) {
    if (arguments.length != 0) {
        if (buffer != null && buffer != undefined &&
                    pos != null && pos != undefined &&
                      size != null && size != undefined) {
                if (!(size < 2)) {
                    var charcode = buffer.getUint8(pos); // Todo : Remove this because its not being used .
                    return buffer.getString(pos+1, size-1);
                }
        }
    }
}



/**
 * @desc - Filter only the needed frames
 * @param {Array} - Array Buffer
 * @param {length} - length of the new buffer
 * @returns {Object} - Returns an object of key pair value meta .
 */
function FrameReader(buffer, dView, length, callback) {
    var Meta = {},
        pos = 0,
        TagVersion = dView.getUint8(3),
        ID3FrameSize = dView.getUint8(3) < 3 ? 6 : 10;

    while (true) {

        var rembytes = length - pos; // Keep track of the remaining bytes

        // Check for a frameheader left
        if (rembytes < ID3FrameSize){ break; }
        // Check for a frame left
        if (buffer.getChar(pos) < 'A' || buffer.getChar(pos) > 'Z'){ break; }

        // reset the framename and framesize .
        var framename = null;
        var framesize = null;

        // Note : framename is 3 for ID3v3 and 4 char after
        if (TagVersion < 3){
            if (pos + framesize > length){ break;  }

            framename = buffer.getString(pos,3);
            framesize = ((buffer.getUint8(pos+5) & 0xFF) << 8) |
                      ((buffer.getUint8(pos+4) & 0xFF) << 16 ) |
                        ((buffer.getUint8(pos+3) & 0xFF) << 24);

            // Friendly framenames .
            Meta[HumanizeFrame(framename)] = parseTextField(buffer, pos +ID3FrameSize, framesize);

            console.info("framename & size  "+framename+":"+framesize);

        } else {
            if (pos + framesize > length){ break;  }

            framename = buffer.getString(pos,4);
            framesize = buffer.getInt(pos+4);

            // Friendly framenames .
            Meta[HumanizeFrame(framename)] = parseTextField(buffer, pos +ID3FrameSize, framesize);

            console.info("framename: "+framename);
            console.info("framesize: "+framesize);

        }
        pos += framesize + ID3FrameSize;
        continue;
    }
    Meta.stackCount = 1;
    callback(Meta);
}



/**
 * @desc - Read meta from binary array buffer data .
 * @docs: [	http://en.wikipedia.org/wiki/ID3	]: ID3 field description
 * @docs: [	http://id3.org/id3v2.4.0-frames	]: track geniers description
 * @docs: [	http://id3.org/	]
 */
function ParseMeta (arBuf, callback) {

    /**
     * @type {Object} - ID3 object
     * @param {number} - array buffer file data
     * @param {number} - starting point to start scanning the array data7
     * @param {number} - length of the array buffer data
     */
    var dView = new DataView(arBuf,0,arBuf.byteLength); // Todo : Find out other parameters this method takes .

    console.log('Getting id3 tags .');

    // Note : ID3 tags are different depending on the file type a picture will return null for certail properties .
    var Meta = {},
        TagVersion = dView.getUint8(3);
        Meta.stackCount = 0;
        Meta.stackSize = arBuf.byteLength;

    // NOTE: ID3v 3 has 3 char id3 framenames and ID3v4 has 4 char framenames .
    if(dView.getString(0, 3) == 'ID3') {
        if (!(TagVersion < 0 || TagVersion > 4)) { // Unsupported tag version check
                console.info("Tag Version: "+ TagVersion);

                var tagSize = dView.getInt(6)+10;

                console.info("Tag size: "+tagSize);

                var uses_synch = (dView.getUint8(5) & 0x80) != 0 ? true : false;
                var has_extended_hdr = (dView.getUint8(5) & 0x40) != 0 ? true : false;

                var headerSize = 0;

                // Check if it has extened header size
                if (has_extended_hdr){
                  return;
                    headerSize = dView.getInt(10);
                    console.info("headersize: "+ headersize);
                }

                // Read the whole tag
                var buffer = new DataView(dView.buffer.slice(10+headerSize, tagSize));

                // Prepare to parse the tag
                var length = buffer.byteLength;

                console.info("buffer length: "+ length);

                // Note : Find out more about this uses_synch property .
                if (uses_synch) {
                  // TODO: Find out what the hell this uses_synch is .
                  return;

                    var newpos =0;
                    // Create a new buffer
                    var newbuffer = new DataView(new ArrayBuffer(tagSize));

                    console.info("new buffer: "+ newbuffer);

                    for( var i = 0; i < tagSize; i++ ){
                        // Note : 1. Checks if the tag position is not out of range
                        //        2. Checks that the tag position value is 255
                        //        3. Checks if the next tag position value is 0
                        if( i <  tagSize-1 && (buffer.getUint8(i) & 0xFF) == 0xFF && buffer.getUint8(i+1) == 0){

                            newbuffer.setUint8(newpos++,0xFF);
                            i++;
                            continue;
                        }
                        newbuffer.setUint8(newpos++, buffer.getUint8(i));
                    }
                    // Note : 1. This might be changing the bufferlength to only
                    //              the places with the metadata, such that we are only reading the meta.
                    //        2. This method changes the buffer by replacing the certain values in the data
                    //              set depending on the condition, so find out what its checking .
                    length = newpos;
                    buffer = newbuffer;
                }

                console.info("new buffer: "+buffer);

                FrameReader(buffer, dView, length, function (meta){
                  console.log('%c Meta','color:azure;');
                  console.dir(meta);
                  MetaHelper.getDurationFromBin((new Blob(new Uint8Array(arBuf))),meta, function(_Meta) {
                    Meta.duration = _Meta.duration;
                    Meta.artwork = _Meta.artwork;
                    Meta.stackCount += 1;
                    onFinish(Meta,callback);
                  });
                });

        } else {
          // unsuppored meta
          Meta.stackCount += 1;
          MetaHelper.getDurationFromBin((new Blob(new Uint8Array(arBuf))),Meta, function(_Meta) {
            Meta.duration = _Meta.duration;
            Meta.artwork = _Meta.artwork;
            Meta.stackCount = 2;
            onFinish(Meta,callback);
          });
        }
    } else {
        // No Meta route
        Meta.stackCount += 1;
        MetaHelper.getDurationFromBin((new Blob(new Uint8Array(arBuf))),Meta, function(_Meta) {
          Meta.duration = _Meta.duration;
          Meta.artwork = _Meta.artwork;
          Meta.stackCount = 2;
          onFinish(Meta,callback);
        });
    }
}


function onFinish(_meta,_callback) {
  // pertialDisplay(_meta); //
  if (_meta.stackCount == 2 || _meta.stackCount != undefined) {
    // pertialDisplay(_meta); //
    MetaHelper.mem -= _meta.stackSize;
    delete _meta.stackSize;
    delete _meta.stackCount;
      _callback({
        name : _meta.name || null,
        title : _meta.title || null,
        artist : _meta.artist || null,
        album : _meta.album || null,
        artwork: _meta.artwork || {
          image : null,
          src : null,
          bin: null
        },
        year : _meta.false || null,     // year <=> false
        duration : _meta.duration || {
          full: null,
          hours: null,
          minutes: null,
          seconds: null
        },
        index : _meta.index || null
      });
    } else {
      return;
    }
}


/**
 * @param {Object} - File to be read.
 * @param {Function} - callback called on finished execution.
 * @returns {Array} - Binary array buffer of the file.
 */
MetaHelper.__proto__.retrieveMeta = function (file, callback) {
  debugger;
  this.mem = (this.mem)? this.mem : 0;
  this.memoryLimit = 1e9;// [1gb]
  // NOTE: Find out how much memory the browser is allowed to have .

  this.resolveQueue = function () {
    // You cannot store files in memory like that .
  }

  if (this.mem > this.memoryLimit-700) {
    return false;
  } else  {
    try {
        var _reader = new FileReader();
       _reader.onload = function (ev) {
           MetaHelper.mem += parseInt(ev.target.result.byteLength);
           ParseMeta(ev.target.result,callback);
       }
       _reader.readAsArrayBuffer(file);
    } catch (_ex) {
        throw new Error({message:"error reading file.", exception:_ex});
    }
  }
}



// TODO: Remove test methods .
function ReadFileEntry(_idx, callback) {
  try {
    debugger;
      self.localGalleryOrigin[(_idx || $('#inputIndex').val())].file(function (_res) {
          callback(_res);
      });
  } catch (_ex) {
      throw new Error({message:"error reading file entry",execption:_ex});
  }
}

/**
 * @desc - Get metadata
 */
MetaHelper.__proto__.getMetaFromFileEntry = function (index, callback) {
  try {
    ReadFileEntry(index, function(File) {
      MetaHelper.etrieveMeta(File, function(ArrayBufffer,_file) {
        var __file = new Blob(ArrayBufffer);
        ParseMeta(ArrayBufffer, __file, function(meta) {
          callback(meta);
        });
      });
    });
  } catch(ex) {
    console.error(ex);
    return ex;
  }
}




})(window);
