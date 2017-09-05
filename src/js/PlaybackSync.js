/**
 * @desc - Acts like a middleware between event executions and player
 *         executions and the visuals .
 *
 */

var PlaybackSync = {

    defaultPoster: function () {
        return document.createElement('img');
    },

    /** @returns {Number} - DomUpdate rate depending on playback rate . */
    progressBarUpdateRate: function (_dur) {
        if (!_dur.hours <= 0) {
            if (_dur.minutes >= 0) {
                if (_dur.seconds > 0) {
                    return 0;
                } else {
                    return 25;
                }
            } else {
                return 50;
            }
        } else {
            return 100;
        }
    },

    updateProgressBar: function (_cur, _dur) {
        _cur = (_cur - ((pauseOffset + initialTime + 1)) + seekOffset)<0 ?
               (_cur - ((pauseOffset + initialTime + 1)) + seekOffset)*-1 :
               (_cur - ((pauseOffset + initialTime + 1)) + seekOffset);
        if (_cur > _dur) { return; }
        if (_cur != undefined) {
            var elSize = $("span#trackProgress-base.trackProgress-base").width();
            if (!this.timeOutOfRange(MetaHelper.durationConverter(_cur, "seconds"), "seconds")) {
                var _tPixelRatio = (_cur / _dur) * elSize;
                $("section#trackProgress-wrap")[0].style.width = _tPixelRatio + "px";
            } else {
                clearInterval(progressBarInterval);
            }
        } else if (player.state == "stopped") {
            $("section#trackProgress-wrap")[0].style.width = 0 + "px";
        }
    },

    updateTime: function () {
        if (CurrentTrack.time.secs + 1 >= 60) {
            CurrentTrack.time.secs = (CurrentTrack.time.secs + 1) - 60;
            if (CurrentTrack.time.mins + 1 >= 60) {
                CurrentTrack.time.mins = (CurrentTrack.time.mins + 1) - 60;
                CurrentTrack.time.hrs = CurrentTrack.time.hrs + 1;
            } else {
                CurrentTrack.time.mins = CurrentTrack.time.mins + 1;
            }
        } else {
            CurrentTrack.time.secs = CurrentTrack.time.secs + 1;
        }
    },

    updateProgress: function (_t, _dur) {
        if (_t != undefined) {
            if (aContxt && bufferSource) {
                if (aContxt.currentTime - (pauseOffset + initialTime + 1) > (bufferSource.buffer.duration ) &&
                            player.state != "playing" && player.state != "paused" ||
                                    player.state == "stopped") { clearInterval(progressTimeInterval); }
            }

            this.updateTime();

            if (_dur.hours < 1) { _dur.hours = false; }

            if (!this.timeOutOfRange(CurrentTrack.time.secs, "seconds") &&
                !this.timeOutOfRange(CurrentTrack.time.mins, "minutes") &&
                !this.timeOutOfRange(CurrentTrack.time.hrs, "hours") ) {

                if (_dur.hours > 0) {

                    $($cHrs[0]).text((CurrentTrack.time.hrs <= 9 && CurrentTrack.time.hrs >= 0) ? '0' + CurrentTrack.time.hrs + ":" : CurrentTrack.time.hrs + ":");
                    $($cMins[0]).text((CurrentTrack.time.hrs) <= 9 || CurrentTrack.time.mins == 0 ? '0' + CurrentTrack.time.mins : CurrentTrack.time.mins);
                    $($cSecs[0]).text((CurrentTrack.time.secs) <= 9 || 0 ? "0" + CurrentTrack.time.secs : CurrentTrack.time.secs);

                } else {

                    $($cMins[0]).text(parseInt(CurrentTrack.time.mins));
                    $($cSecs[0]).text((CurrentTrack.time.secs) <= 9 || 0 ? "0" + CurrentTrack.time.secs : CurrentTrack.time.secs);

                }
            } else {
                clearInterval(progressTimeInterval);
            }
        } else if (player.state == "stopped") {
            $($cHrs[0]).text("");
            $($cMins[0]).text(0);
            $($cSecs[0]).text("00");
        }
    },

    // NOTE: Makes sure that the timer stops when the time is out of range.
    // @bugs : This method does not take into consideration other elements like pause, seekOffset
    timeOutOfRange: function (time, period) {
        if (CurrentTrack && period && CurrentTrack.duration && CurrentTrack.duration != null) {
            if (parseInt(time > 0)) {
                switch (period) {
                    case "hours": return !(CurrentTrack.duration[period] << 0 < parseInt(time)); break;
                    case "minues": return !(CurrentTrack.duration[period] << 0 < parseInt(time)); break;
                    case "seconds": return !(CurrentTrack.duration[period] << 0 < parseInt(time)); break;
                }
            } else {
                return false;
            }
        }
    },

    /** @desc - overal progress update . */
    PlaybackProgressBar: function (_cur, _dur) {
        if (_cur != undefined) {
            var dur;
            if (_dur && typeof _dur != "object") {
                dur = {
                    hours: MetaHelper.durationConverter(_dur, 'hours'),
                    minutes: (MetaHelper.durationConverter(_dur, 'hours') <= 0) ?
                        parseInt(MetaHelper.durationConverter(_dur, 'minutes')) :
                             "0" + MetaHelper.durationConverter(_dur, 'minutes'),
                    seconds: MetaHelper.durationConverter(_dur, 'seconds')
                };
            } else {
                dur = CurrentTrack.duration;
            }
            if (dur.minutes >= 60) { dur.minutes = ("0" + (dur.minutes - 60)).toString() }
            if (dur.seconds >= 60) { dur.seconds = ("0" + (dur.seconds - 60)).toString() }
            // Reset the track progress time .
            CurrentTrack.start = "00:00:00";
            CurrentTrack.end = dur.hours + ":" + dur.minutes + ":" + dur.seconds;

            $($dHrs[0]).text((dur.hours > 0) ? dur.hours + ":" : "");
            $($dMins[0]).text(dur.minutes);
            $($dSecs[0]).text(dur.seconds);

            if (CurrentTrack.time.secs == null) {
                $($cHrs[0]).text("");
                $($cMins[0]).text("0");
                $($cSecs[0]).text("00");
            }

            progressBarInterval = setInterval(function () {
                if (player.state != "stopped" || player.state == "paused" || player.state == "playing") {
                    if (aContxt && aContxt.state != "closed") {
                        if (bufferSource && aContxt) {
                            PlaybackSync.updateProgressBar(aContxt.currentTime, bufferSource.buffer.duration);
                        }
                    } else if (PlaybackSync.videoPlaying()) {
                        var currentTime = $videoPlayer.currentTime;
                        var duration = $videoPlayer.duration;
                        PlaybackSync.updateProgressBar(currentTime, duration);
                    }
                } else {
                    clearInterval(progressBarInterval);
                }
            }, this.progressBarUpdateRate(_dur));

            progressTimeInterval = setInterval(function () {
                if (player.state != "stopped" && player.state == "playing") {
                    if (aContxt && aContxt.state != "closed") {
                        PlaybackSync.updateProgress(CurrentTrack.time, _dur);
                     } else {
                        PlaybackSync.updateProgress(CurrentTrack.time, _dur);
                     }
                } else {
                    clearInterval(progressTimeInterval);
                }
            }, 1000);
        } else {
            if (player.state == "paused" || player.state == "playing") {
                clearInterval(progressBarInterval);
                clearInterval(progressTimeInterval);
            } else if (player.state == "stopped" || player.state == "initial") {
                clearInterval(progressBarInterval);
                clearInterval(progressTimeInterval);
                this.updateProgress();
                this.updateProgressBar();
            }
        }
    },

    trimTitle: function (title) {
        if (title && title.length > 60) {
            return (title.slice(0, 57)) + "...";
        } else {
            return title || "Unknown Title";
        }
    },

    trimAlbum: function (album) {
        if (album && album.length > 13) {
            return album.slice(0, 13);
        } else {
            return album ||  "Unknown Album";
        }
    },

    trimArist: function (artist) {
        if (artist && artist.length > 12) {
            return artist.slice(0, 13);
        } else {
            return artist || "Unknown Artist";
        }
    },

    resetTracktDetailsVisuals: function () {
        $($("#musicName"))
					.text("")
					.show()
					.text(this.trimTitle(MetaHelper.parseFileName(CurrentTrack.name)));
        $($("#musicAlbum"))
                    .text("")
                    .show()
                    .text(this.trimAlbum(CurrentTrack.album));
        $(".timeLeft").show();
        $(".SongDuration").show();

        player.state = "playing";

        $playNob
    			.removeClass('playTrack')
    			.addClass("pauseTrack");
    },

    ResetPlayback: function () {
        aContxt = null;
        PlaybackSync.PlaybackProgressBar();
        aContxt = new AudioContext();
    },

    changeVolume: function (_volVal) {
        if (player.state && player.state !== "paused" && bufferSource && aContxt) {
            if (_volVal && !undefined)
                volume = _volVal;
                gainNode.gain.value = _volVal;
        }
    },

    /** @desc - Sets the current playing tracking details  */
    SetCurrentTrack: function (title, index) {
        CurrentTrack = new Object({
            name: PlaybackSync.trimTitle(meta[index].source.name),
            title: PlaybackSync.trimTitle(meta[index].title),
            artist: PlaybackSync.trimArist(meta[index].artist),
            album: PlaybackSync.trimArist(meta[index].album),
            artwork: meta[index].artwork,
            start: null,
            end: null,
            time: {
                hrs: 0,
                mins: 0,
                secs: 0
            },
            duration: null,
            lastStartTime: null,
            index: index,
            size: null,
            playbackPosition: 0 // [ms]
        });
    },

    /** @returns {Number} - next track index - used while playback is not playing . */
    setNextTrack: function (index) {
        var lastIndex = index || SetCurrentTrack.index;
        if (bufferSource == null) {
            if (!ShuffleOn) {
                nextPlaybackIndex.push(parseInt(preTrackIndex[preTrackIndex.length] + 1));
            } else {
                var nextIndex = Math.floor(Math.random() * meta.length - 1);
                if (lastIndex != undefined && nextIndex == lastIndex) {
                    this.setNextTrack(lastIndex);
                } else {
                    nextPlaybackIndex.push(nextIndex);
                }
            }
        } else {
            if (!ShuffleOn) {
                nextPlaybackIndex.push(parseInt(preTrackIndex[0] + 1));
            } else {
                var nextIndex = Math.floor(Math.random() * meta.length - 1);
                if (lastIndex != undefined && nextIndex == lastIndex) {
                    this.setNextTrack(lastIndex);
                } else {
                    nextPlaybackIndex.push(nextIndex);
                }
            }
        }
    },

    /** @returns {Number} - track index to be played next */
    getNextTrack: function (index) {
        var randomTrack;
        lastIndex = (function () {
            if (index == undefined) {
                if (CurrentTrack != null) {
                    return CurrentTrack.index;
                } else {
                    return undefined;
                }
            } else {
                return index;
            }
        })()
        if (nextPlaybackIndex.length > 0) {
            return nextPlaybackIndex.shift();
        } else if (ShuffleOn) {
            randomTrack = Math.floor(Math.random() * meta.length - 1);
            if (lastIndex != undefined && randomTrack == lastIndex) {
                this.setNextTrack(lastIndex);
            } else {
                return randomTrack;
            }
        } else {
            if (preTrackIndex.length > 0) {
                if (ShuffleOn) {
                    randomTrack = Math.floor(Math.random() * meta.length - 1);
                    if (lastIndex != undefined && randomTrack == lastIndex) {
                        this.setNextTrack(lastIndex);
                    } else {
                        return randomTrack;
                    }
                } else {
                    if (parseInt(preTrackIndex[preTrackIndex.length - 1]) + 1 > meta.length - 1) {
                        return 0;
                    } else {
                        randomTrack = parseInt(preTrackIndex[preTrackIndex.length - 1]) + 1;
                        if (lastIndex != undefined && randomTrack == lastIndex) {
                            this.setNextTrack(lastIndex);
                        } else {
                            return randomTrack;
                        }
                    }
                }
            } else {
                if (ShuffleOn) {
                    randomTrack = Math.floor(Math.random() * meta.length - 1);
                    if (lastIndex != undefined && randomTrack == lastIndex) {
                        this.setNextTrack(lastIndex);
                    } else {
                        return randomTrack;
                    }
                } else {
                    return 0;
                }
            }
        }
    },

    bufferReady: false,

    loadTrack: function (event) {
        if (PlaybackSync.videoPlaying()) {
            eventHandler.togglePlaybackControls();
            eventHandler.toggleVideoPlayer();
        } else {
            if (player && player.state === "playing" || player.state == "paused") {
                //<debug>
                // @bug - rapid playback toggle from user interaction causes bugs to happen .
                // Test how long it takes to toggle a playback and test if the bug to rapid user
                // interaction still exist.
                //</debug>
                console.time("[Playback Toggle]");
                PlaybackSync.togglePlayback();
                console.timeEnd("[Playback Toggle]");
            } else {
                if (meta.length > 0) {

                    var nextTrack = PlaybackSync.getNextTrack();

                    eventHandler.toggleActiveTrack(nextTrack);

                    Buffering = true;

                    $("#inputIndex").val(nextTrack);

                    preTrackIndex.push(parseInt(nextTrack));

                    PlaybackSync.SetCurrentTrack(meta[nextTrack].name, nextTrack);
                    PlaybackSync.EndAudioPlayback(false);
                    PlaybackSync.resetTracktDetailsVisuals();
                    PlaybackSync.Play(nextTrack);

                    player.state = "playing";

                }
            }
        }
    },

    loadNextTrack: function (nextTrack) {
        if (player.state === "stopped" && preTrackIndex.length > 0) {
            if (Buffering) return;

            eventHandler.toggleActiveTrack(nextTrack);
            Buffering = true;
            preTrackIndex.push(parseInt(nextTrack));

            PlaybackSync.EndAudioPlayback(false);
            PlaybackSync.resetTracktDetailsVisuals();
            PlaybackSync.SetCurrentTrack(meta[nextTrack].name, nextTrack);
            PlaybackSync.SetDefaultPosterImage();
            PlaybackSync.Play(nextTrack);

        } else {
            if (!nextPlaybackIndex.length > 0) {
                PlaybackSync.setNextTrack(nextTrack);
            }
        }
    },

    loadPreviousTrack: function (selectedTrackIndex) {
        if (Buffering || preTrackIndex.length === 1 || preTrackIndex.length === 0 ||
             CurrentTrack.name == meta[preTrackIndex[preTrackIndex.length - 1]].source.name) { return; }
        if (player.state === "playing" && player.state != "paused" && preTrackIndex.length > 0) {

            eventHandler.toggleActiveTrack(selectedTrackIndex);

            Buffering = true;

            var previousTrackIndex = (preTrackIndex == 1) ? selectedTrackIndex : selectedTrackIndex;

            preTrackIndex.push(parseInt(previousTrackIndex));

            PlaybackSync.SetCurrentTrack(meta[previousTrackIndex].name, previousTrackIndex);
            PlaybackSync.EndAudioPlayback(true);
            PlaybackSync.resetTracktDetailsVisuals();
            PlaybackSync.SetDefaultPosterImage();
            PlaybackSync.Play(previousTrackIndex);


        } else {
            previousPlaybackIndex = (preTrackIndex.length > 0) ? preTrackIndex.pop() : null;
        }
    },


    virtualize: function (analyser) {
        oVirtualize(analyser);
    },

    AttachPlayer: function (index, _el) {
        if (Buffering) { return; }
        Buffering = true;

        if (_el) { PlaybackSync.SetCurrentTrack(_el) }
        else { PlaybackSync.SetCurrentTrack(meta[index].name, index) }

        $('#inputIndex').val(index);

        PlaybackSync.Play(index);
    },

    HardReset: function () {
        PlaybackSync.SoftReset("video");
        PlaybackSync.SoftReset("audio", false);
    },

    SoftReset: function (type, controlled) {
        if (type == "video") {

            eventHandler.resetMusicDetailsVisuals();

            Buffering = false;

            $videoPlayer.src = "null";

            $($videoPlayer).show();

            $videoPlayer.backgroundSize = "200px";
            $videoPlayer.backgroundPosition = "280px 100px";
            $videoPlayer.background = "url(../icons/clapboard-icon.png) no-repeat";

        } else {
            if (aContxt && aContxt.state != "closed") { aContxt.close(); }

            // stop gracefully
            workerNode = null;
            analyser = null;
            bufferSource = null;
            gainNode = null;
            aContxt = null;

            if (controlled) { return; }

            // Reset the Track progress
            startTime = 0;
            pauseTime = 0;
            pauseOffset = 0;
            startOffset = 0;
            seekOffset = 0;
            initialTime = 0;

            CurrentTrack.lastStartTime = 0;

            PlaybackSync.PlaybackProgressBar();

            eventHandler.resetMusicDetailsVisuals();

            player.state = false;
        }
    },

    EndVideoPlayback: function (ev) {
        if (bufferSource != undefined && aContxt != undefined
  			             && bufferSource != null && aContxt != null &&
  									                 !($videoPlayer.loop)) {
            console.log('%c video ended !', 'color:red');
            $videoPlayer.loop = false;
            if (player.state == "paused" || player.state == "playing") {
                processor.end();
                PlaybackSync.PlaybackProgressBar();
                eventHandler.togglePlaybackControls();
                PlaybackSync.HardReset();
            } else {
                processor.end();
                PlaybackSync.PlaybackProgressBar();
                PlaybackSync.EndAudioPlayback(true);
                PlaybackSync.SoftReset("video");
            }
        } else {
            if (typeof ev == "undefined") {
                PlaybackSync.PlaybackProgressBar();
                eventHandler.resetMusicDetailsVisuals();
                PlaybackSync.SoftReset("video");
            } else {
                PlaybackSync.PlaybackProgressBar();
                eventHandler.resetMusicDetailsVisuals();
                PlaybackSync.HardReset();
                PlaybackSync.AutoPlay();
            }
        }
    },

    getVideoPosterImage: function () {
        return null;
    },

    getAudioPosterImage: function () {
        return null;
    },

    SetDefaultPosterImage: function () {
        $videoPlayer.background = "url(../icons/clapboard-icon.png) no-repeat";
        $videoPlayer.backgroundSize = "200px";
        $videoPlayer.backgroundPosition = "280px 100px";
    },

    videoProgress: function (ev) {
        startOffset = 0;
        pauseTime = 0;
        seekOffset = 0;
        PlaybackSync.updateProgressBar(ev.timeStamp, ev.path[0].duration);
    },

    // NOTE: vidio playbacks are handled by the eventHandler
    PauseVideoPlayback: function () {
        console.time("[video toggleplayback]");
        PlaybackSync.PlaybackProgressBar();
        eventHandler.togglePlaybackControls();
        console.time("[video toggleplayback]");
    },

    PlayVideoPlayback: function (curTime, durTime) {
        console.time("[video toggleplayback]");
        if (typeof curTime != "object") {
            PlaybackSync.PlaybackProgressBar(curTime, durTime);
            eventHandler.togglePlaybackControls();
        } else {
            eventHandler.togglePlaybackControls();
        }
        console.time("[video toggleplayback]");
    },

    setVideoPlaybackDetails: function () {
        var duration = $videoPlayer.duration;
        var currentTime = $videoPlayer.currentTime;

        CurrentTrack.duration = duration;

        PlaybackSync.resetTracktDetailsVisuals();
        PlaybackSync.PlaybackProgressBar(currentTime, duration);
    },

    VideoPlayback: function (file, index) {
        PlaybackSync.HardReset();

        preTrackIndex.push(parseInt(index || preTrackIndex[preTrackIndex.length - 1]));

        PlaybackSync.EndVideoPlayback();

        $($videoPlayer).show();

        $($("div.left-side ul li:nth-child(5)")[0]).click();

        $videoPlayer.controls = false;
        $videoPlayer.loop = ($("#RepeatToggle span").text() == 1);
        $videoPlayer.onended = PlaybackSync.EndVideoPlayback;
        $videoPlayer.onplay = PlaybackSync.PlayVideoPlayback;
        $videoPlayer.onpause = PlaybackSync.PauseVideoPlayback;
        $videoPlayer.style.marginLeft = "-15px";
        // $videoPlayer.ontimeupdate = PlaybackSync.videoProgress;
        $videoPlayer.src = URL.createObjectURL(file);

        eventHandler.togglePlaybackControls();

        $($videoPlayer).volume = eventHandler.convertVolumeVal($volumeRange.val());

        this.SetCurrentTrack(MetaHelper.parseFileName(file.name), index);
        eventHandler.togglePlaybackControls();
        $videoPlayer.oncanplaythrough = this.setVideoPlaybackDetails;
        Buffering = false;

    },

    resetPlaybackPOS: function () {
        initialTime = 0;
        pauseTime = 0;
        startOffset = 0;
        seekOffset = 0;
    },


    /** @desc -  set time where to start playback from */
    setPlaybackPOS: function () {},

    changeTrackCurrentTime: function (time) {
        CurrentTrack.time.hrs = parseInt(MetaHelper.durationConverter(time, "hours"));
        CurrentTrack.time.mins = parseInt(MetaHelper.durationConverter(time, "minutes"));
        CurrentTrack.time.secs = parseInt(MetaHelper.durationConverter(time, "seconds"));
    },

    ControlledPlayback: function (time) {
        if (player.state != "stopped" && !Buffering) {

            PlaybackSync.PlaybackProgressBar();

            if (PlaybackSync.videoPlaying()) {
                $videoPlayer.currentTime = time;

                PlaybackSync.changeTrackCurrentTime(time);

            } else {
                var curTime = aContxt.currentTime;
                player.state = false;
                seekOffset = time;
                startTime = seekOffset;

                PlaybackSync.setPlaybackPOS(time);

                start = time;
                bufferSource.stop(0);

                PlaybackSync.EndAudioPlayback(true);

                seekOffset = seekOffset>curTime? seekOffset: seekOffset*-1;

                processor.start();

                PlaybackSync.changeTrackCurrentTime(time);

                start = null;
                player.state = "playing";
            }
        }
    },

    resetQueue: function () {
        this.Queue.__proto__.track = undefined;
        this.Queue.__proto__.next = undefined;
    },

    Queue: function (index, direction) {
        this.Queue.__proto__.track = parseInt(index);
        this.Queue.__proto__.next = direction == "next" ? true : false;
    },

    ResolvePlaybackQueue: function () {
        if (PlaybackSync.Queue.next) {

            player = new Player("stopped", meta[PlaybackSync.Queue.track].source, Player.DEFAULTS.REPEAT, Player.DEFAULTS.SHUFFLE, Player.DEFAULTS.VOLUME);
            player.loadNextTrack(PlaybackSync.Queue.track);
            player.state = "playing";

            PlaybackSync.resetQueue();

        } else {

            player = new Player("stopped", PlaybackSync.Queue.track, Player.DEFAULTS.REPEAT, Player.DEFAULTS.SHUFFLE, Player.DEFAULTS.VOLUME);
            player.loadPreviousTrack(PlaybackSync.Queue.track);

            PlaybackSync.resetQueue();

        }
    },


    IsFirstQueue: function () {
        PlaybackSync.Queue.track == undefined;
    },


    RequestPlayback: function (index, direction) {
        if (index != undefined && !Buffering) {
            if (!(PlaybackSync.IsFirstQueue())) { clearTimeout(self.queueTimeout) }
            if (direction == "next") { preTrackIndex.push(index); }

            PlaybackSync.SetCurrentTrack(meta[index].name, index);
            PlaybackSync.resetTracktDetailsVisuals();

            this.Queue(index, direction);

            self.queueTimeout = setTimeout(PlaybackSync.ResolvePlaybackQueue, 3500);
        }
    },

    videoPlaying: function () {
        return !($videoPlayer.src.search(/\/null/) >= 0);
    },

    AudioPlayback: function (rawBuffer) {
        processor.InitializePlayback(rawBuffer);
    },

    togglePlayback: function () {
        if (player.state != "paused" && player.state != "stopped") {

            //NOTE: Pause function checks if its playing and progressbar checks if its paused .
            PlaybackSync.Pause();

            player.state = "paused";

            PlaybackSync.PlaybackProgressBar();

            eventHandler.togglePlaybackControls();

            $LogInfo("Paused", 0, null);
        } else {
            // pauseOffset = aContxt.currentTime - pauseTime;

            PlaybackSync.Play();

            player.state = "playing";

            eventHandler.togglePlaybackControls();

            $LogInfo("Playing", 0, null);
        }
    },

    Pause: function () {

        this.setPlaybackPOS();

        pauseTime = aContxt.currentTime;

        // NOTE: We have to keep track of the buffer position even if we seek.
        startTime = (aContxt.currentTime - initialTime) + seekOffset;

        CurrentTrack.playbackPosition = aContxt.currentTime - initialTime;

        bufferSource.stop(0);

        console.log("%c Pause time[ " + startTime + " ]", "color:green");
    },


    Play: function (index) {
        if (index != undefined) {

            var IsVideo = (meta[index].source.name.search(/(.*)[.mp4|.webm|.ogg|.mkv|.vob]$/img) >= 0) ? true : false;

            $("#inputIndex").val(index);

            PlaybackSync.PlaybackProgressBar();
            PlaybackSync.resetTracktDetailsVisuals();

            eventHandler.toggleActiveTrack(index);

            if (IsVideo) {
                PlaybackSync.VideoPlayback(meta[index].source, index);
            } else {
                var reader = new FileReader();

                reader.onloadend = function (eve) {
                    if (eve)
                        PlaybackSync.AudioPlayback(eve.target.result);
                }

                console.info("Reading ...");
                reader.readAsArrayBuffer(meta[index].source);
            }
        } else {
            processor.start();
        }
    },


    /** @param {boolean} - Whether the playback end involved user interaction or an error . */
    EndAudioPlayback: function (controlled) {
        if (typeof controlled != undefined && bufferSource && aContxt) {
            if (bufferSource.buffer.duration <
                    ((aContxt.currentTime - (pauseOffset + initialTime+ 1)+1) + seekOffset) &&
                                        (player.state == "playing" || player.state != "paused")) {
                if (bufferSource) { bufferSource.stop(0); }

                previouslyPaused = false;
                Buffering = false;

                PlaybackSync.PlaybackProgressBar();
                PlaybackSync.SoftReset("audio", controlled);

                if (controlled) return;

                eventHandler.resetMusicDetailsVisuals();

                this.AutoPlay();
            }
        }
    },


    AutoPlay: function () {
        if (typeof LoopOn == "string") {
            if (aContxt && aContxt.state == "running") { processor.end() }

            eventHandler.togglePlaybackControls();

            PlaybackSync.PlaybackProgressBar();
            PlaybackSync.HardReset();

            Player.prototype.AttachPlayer(parseInt(preTrackIndex[preTrackIndex.length - 1]));

        } else {
            if (nextPlaybackIndex.length > 0) {
                if (aContxt && aContxt.state == "running"){ processor.end() }

                var nextTrack = nextPlaybackIndex.shift();

                PlaybackSync.PlaybackProgressBar();
                PlaybackSync.HardReset();

                eventHandler.togglePlaybackControls();
                eventHandler.toggleActiveTrack(nextTrack);

                Player.prototype.AttachPlayer(nextTrack);

            } else {
                if (LoopOn == true) {
                    if (aContxt && aContxt.state == "running"){ processor.end() }
                    $LogInfo("Playing next track . ", 0, null);
                    var nextTrack;
                    if (!ShuffleOn) {
                        if (parseInt(preTrackIndex[preTrackIndex.length - 1]) >= meta.length - 1) {

                            nextTrack = 0;
                            preTrackIndex = [];

                        } else {
                            nextTrack = parseInt(preTrackIndex[preTrackIndex.length - 1]) + 1;
                        }
                    } else {
                        nextTrack = Math.floor(Math.random() * meta.length - 1);
                    }

                    PlaybackSync.HardReset();
                    PlaybackSync.PlaybackProgressBar();

                    eventHandler.toggleActiveTrack(nextTrack);

                    preTrackIndex.push(nextTrack);

                    Player.prototype.AttachPlayer(nextTrack);

                } else {
                    if (aContxt && aContxt.state == "running") { processor.end() }

                    processor.end();

                    PlaybackSync.HardReset();
                    PlaybackSync.PlaybackProgressBar();

                    eventHandler.togglePlaybackControls();

                }
            }
        }
    }
};
