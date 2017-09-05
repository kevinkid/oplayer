/**
 * @desc - Event handlers for elements in the application .
 */
var timerSize;

var eventHandler = {

    setAppStateListeners: function () {
        // NOTE: - The last state of the window is kept on the next time the application is launched.
        // @bug - This method is being called twice, because of the maximize window. 
        window.onresize = this.onWindowResize;
        $(".OnlineTabView div").on("click", function (event) {
            if (event.which == 1) {
                eventHandler.resizeWindow(event);
            }
        });
        $(".videoPlayerTabView div").on("click", function (event) {
            if (event.which == 1) {
                eventHandler.resizeWindow(event);
            }
        });
        // chrome.app.window.onclose = function () {
            
        //     // TODO: Handle some of the application life cycle executions 
        //     // NOTE: This method maybe called after the window is closed.
        //     console.log("Closing application window .");
        // }
        $closeBtn.on("click", function (event) {
            console.log("Closing application window");
            window.close();
        });
        var webview = document.querySelector('#app-webview');
        webview.addEventListener('permissionrequest', function(ev) {
            worker.onWebRequest(ev);
        });
    },

    resizeWindow: function (event) {
        //  TODO: Write css to make the application responsive in that case .
        // if (self.activeTab == "online" || self.activeTab == "video") {
        //     if ($("#resize").hasClass("resize-max")) {
        //         // Minimize
        //         $("#resize")
        //             .removeClass("resize-max")
        //             .addClass("resize-min");
        //         $(".hoverSlide").hide();
        //         event.currentTarget.style.left = "84%";
        //         $("span#trackProgress-base.trackProgress-base").width();// TODO: Change the width of the video 
        //         chrome.app.window.current().maximize();
        //         PlaybackSync.SetDefaultPosterImage();
        //     } else {
        //         // Maximize
        //         $("#resize")
        //             .removeClass("resize-min")
        //             .addClass("resize-max");
        //         $(".hoverSlide").show();
        //         event.currentTarget.style.left = "93%";
        //         $("span#trackProgress-base.trackProgress-base").width(); // TODO: Change the width of the video 
        //         chrome.app.window.current().restore();
        //         PlaybackSync.SetDefaultPosterImage();
        //     }
        // }
    },

    onWindowResize: function (ev) {
        if (ev) {
            // NOTE: !important This could be a bad thing because we are changing classes after resizing, maybe
            //        call this method before the window resize .

            // NOTE: The window resizes first then it calls this method but the classes changes
            //        so check for the opposite class to determine the resize .

            // TODO: Write css to make the whole window responce and make sure the sidebar is not accesible when on max
            //       , that is to just reduce the posiblity of css errors lol .

            $("section#trackProgress-wrap").width = ev.currentTarget.outerWidth; // clientWidth
            if ($("#resize").hasClass("resize-min")) {
                $(document.body).addClass("win-max");
            } else {
                $("#resize").removeClass("win-max");
            }
        }
    },

    showSettingsModel : function (){} ,

    showInfoModal: function () { },

    hideInfoModal: function () { },

    hidePreloader: function () {
        toggleNotification = false;
        $('[data-main="content"]').removeClass('loading');
        $("#main-view").removeAttr("class");
        $("#desktopFooterWrapper").removeAttr("class");
        $(".preloaderWrap-open").attr("class", "preloaderWrap-closed");
        $(".preloader-open").attr("class", "preloadep-cloed");
    },

    setTimeController: function () {
        var lastPos = 0, // [px]
          	lastWidth = 0,
          	defaultWidth = 50; // [px]

        /** @returns {Number} - convert mouse position to time using song duration */
        function mousePosTimeRatio(pos) {
            if (CurrentTrack) {
                return ((100 * (pos / 799)) * CurrentTrack.duration / 100);
            }
        }

        function updateTimerTime(time) {
            $("#timeControl").text(time);
        }

        function moveTimer(pos) {
            timerSize = timerSize || defaultWidth + 30;
            if (pos > (799 -  timerSize)) {
                if (activeTab == "video" || activeTab == "online") {
                    updateTimerTime(MetaHelper.durationConverter(mousePosTimeRatio(pos), "full"));
                    $("#timeControl")[0].style.top = "5px";
                    $("#timeControl")[0].style.left = lastPos + "px";
                    $("#timeControl")[0].style.width = defaultWidth + "px";
                } else {
                    updateTimerTime(MetaHelper.durationConverter(mousePosTimeRatio(pos), "full"));
                    $("#timeControl")[0].style.top = "-20px";
                    $("#timeControl")[0].style.left = lastPos + "px";
                    $("#timeControl")[0].style.width = defaultWidth + "px";
                }
            } else {
                if (activeTab == "online" || activeTab == "video") {
                    updateTimerTime(MetaHelper.durationConverter(mousePosTimeRatio(pos), "full"));
                    lastPos = pos;
                    $("#timeControl")[0].style.top = "5px";
                    $("#timeControl")[0].style.left = pos + "px";
                    $("#timeControl")[0].style.width = defaultWidth + "px";
                } else {
                    updateTimerTime(MetaHelper.durationConverter(mousePosTimeRatio(pos), "full"));
                    lastPos = pos;
                    $("#timeControl")[0].style.top = "-20px";
                    $("#timeControl")[0].style.left = pos + "px";
                    $("#timeControl")[0].style.width = defaultWidth + "px";
                }
            }
        }

        $("#timeControlBase").on('mouseenter', function (event) {
            if (CurrentTrack && CurrentTrack.duration != null) {
                $("#timeControl").show();
                $("#timeControlBase").on('mouseleave', function (event) {
                    $("#timeControl").hide();
                    event.currentTarget.removeEventListener('mousemove', function () { });
                    event.currentTarget.removeEventListener('mouseup', function () { });
                });
            }
        });

        $("#timeControlBase").on('mousemove', function (event) {
            moveTimer(event.clientX);
        });

        $("#timeControlBase").on('mouseup', function (event) {
            if (true) { // PlaybackSync.bufferReady
                if (player.state == "playing"|| player.state == "paused") {
                    PlaybackSync.ControlledPlayback(mousePosTimeRatio(event.clientX));
                }
            }
        });
        $("#timeControl").hide();
    },

    togglePlaybackControls: function () {
        if (!$("span.pauseTrack").length > 0) {
            $("span.playTrack").removeClass('playTrack');
            $("#play").addClass("pauseTrack");
        } else {
            $("span.pauseTrack").removeClass('pauseTrack');
            $("#play").addClass("playTrack");
        }
    },

    setPlaybackListeners: function () {
        /** @desc - play button event handler  */
        $("#play").on('click', function (event) {
            if (meta.length > 1) {
                if (player && player.state == "paused" || player.state == "playing"){
                    if (Buffering) { return; }
                    event.stopPropagation();
                    player.loadTrack(event);
                } else {
                    player = new Player("stopped", meta[PlaybackSync.getNextTrack()].source, Player.DEFAULTS.REPEAT, Player.DEFAULTS.SHUFFLE, Player.DEFAULTS.VOLUME);
                    player.loadTrack(event);
                }
            }
        });
        /** @desc - previous button event handler . */
        $("#preTrack").on('click', function (event) {
            if (meta.length > 1) {
                event.stopPropagation();

                processor.end();
                PlaybackSync.HardReset();
                PlaybackSync.PlaybackProgressBar();
                eventHandler.resetMusicDetailsVisuals();
                preTrackIndex.pop();
                PlaybackSync.RequestPlayback(preTrackIndex.pop(), "previous");
            }
        });
        /** @desc - Next button event handler . */
        $("#nextTrack").on('click', function (event) {
            if (meta.length > 1) {
                event.stopPropagation();

                processor.end();
                PlaybackSync.HardReset();
                PlaybackSync.PlaybackProgressBar();
                eventHandler.resetMusicDetailsVisuals();
                PlaybackSync.RequestPlayback(PlaybackSync.getNextTrack(), "next");
            }
        });
    },

    toggleVideoPlayer: function (event) {
        var curTime = $("#videPlayer")[0].currentTime;
        var durTime = $("#videPlayer")[0].duration;
        if ($("#videPlayer")[0].paused) {
            if (CurrentTrack) {
                if (CurrentTrack.duration) {
                    $("#videPlayer")[0].play();
                    PlaybackSync.PlayVideoPlayback(curTime, durTime);
                }
            }
        } else {
            $("#videPlayer")[0].pause();
            PlaybackSync.PauseVideoPlayback();
        }
    },
    
    setNotification: function () {
        // open notification
        toggleNotification = true;
        $("#main-view").attr("class", "loading");
        $('[data-main="content"]').attr("class", "loading");
        $("#desktopFooterWrapper").attr("class", "loading");
        $(".preloaderWrap-closed").attr("class", "preloaderWrap-open");
        $(".preloader-closed").attr("class", "preloadep-open");
        $("#preloaderWrap").on('click', function (event) { return; });
    },

    setTestingListeners: function () {
        $("#getData").on("click", function (event) {
            if (event.which == 1)
                MetaHelper.getMetaFromFileEntry($('#inputIndex').val(), function (meta) {

                    console.log('%c meta', 'color:red;');
                    console.dir(meta);

                    // clear
                    $MetaLog.text("");
                    debugger;
                    //<debug> Make sure that the data meta is being displayed . </debug>
                    trimTitle(meta);

                    for (var key in meta) {
                        if (key == "image") {

                            meta.image = meta[key];
                            var imageEle = document.createElement("img");
                            imageEle.src = createAlbumArtwork(meta[key].file);
                            $MetaLog.append(imageEle);
                            meta.artwork = imageEle;

                        } else {
                            if (key == "duration") {
                                var newChild = document.createElement("div");
                                newChild.setAttribute("class", "metaItem");
                                newChild = $(newChild);
                                newChild.text(key + " : " + meta[key].full);
                                $MetaLog.append(newChild);
                            } else {
                                var newChild = document.createElement("div");
                                newChild.setAttribute("class", "metaItem");
                                newChild = $(newChild);
                                newChild.text(key + " : " + meta[key]);
                                $MetaLog.append(newChild);
                            }
                        }
                    }

                });
        });
        $("#noiseReduction").on("click", function (event) { processor.NoiseReduction() });
        $("#installBtn").on('click', function (event) { window.open('https://soundcloud.com/', '_blank') }); // TODO: Add install link
        $("#close").on('click', function (event) { window.close() });
    },

    convertVolumeVal: function (vol) {
        if (vol.search("-") >= 0) {
            return vol < -0.5 ? parseFloat(vol) + 1 : (parseFloat(vol) * 0.5) + 0.5;
        } else {
            return vol == 0 ? 0.5 : (parseFloat(vol) / 2) + 0.5;
        }
    },

    changePlaybackVolume: function () {
        var smoothVolController = setInterval(function () {
            var volVal = $volumeRange.val();
            $videoPlayer.volume = eventHandler.convertVolumeVal(volVal);
            volume = volVal;
            if (!!volHeldDown) {
                if (player.state == "paused"|| player.state == "playing" && bufferSource) {
                    PlaybackSync.changeVolume($volumeRange.val());
                }
            } else { clearInterval(smoothVolController) }
        }, 10);
    },

    showVolumeRange: function () {
        $volumeRange.show();
    },

    hideVolumeRange: function () {
        setTimeout(function () { $volumeRange.hide() }, 3500);
    },

    setVolControlListener: function () {

        $VolumeControl.on("mouseenter", function () { eventHandler.showVolumeRange() });
        $volumeRange.on("mouseenter", function () { eventHandler.showVolumeRange() });
        $volumeRange.on("mouseleave", function () { eventHandler.hideVolumeRange() });
        $volumeRange.on('onmousewheel', function (event) {
            console.dir(event);
            // TODO: change the volume and changes position of the range .
        });
        $volCtrl = $($volCtrl);
        $volCtrl.mousedown(function () {
            volHeldDown = true;
            eventHandler.changePlaybackVolume();
        });
        //scrolling end
        $volCtrl.mouseup(function () {
            volHeldDown = false;
        });
    },

    setSingleTrackListeners: function () {
        $(".songTitle").on('mousedown', function (event) {
            if (event.which == 3) {
                $(".LocalTabView").on("mouseenter", function (event) {
                    $.removeEvent(".LocalTabView", 'mouseenter', function () {
                        // TODO: Remove eventListener .
                     });
                    removeContextMenuItem();
                });
                createContextMenuItem("Play Next", event.currentTarget.attributes[1].value);
                // dispatchEvent(event); //
            } else if (event.which == 1 && !Buffering) {
                processor.end();
                PlaybackSync.HardReset();
                eventHandler.toggleActiveTrack(event);
                preTrackIndex.push(parseInt(event.currentTarget.attributes[1].value));
                PlaybackSync.PlaybackProgressBar();
                eventHandler.resetMusicDetailsVisuals();
                PlaybackSync.RequestPlayback(event.currentTarget.attributes[1].value, "next");
            }
        });
    },

    setCustomScrollbar: function () {
        // TODO: Remove this custom scroll bar .
        $.mCustomScrollbar.defaults.theme = "light-2";
        $(".mui-list").mCustomScrollbar();
        $(".SyncTabView").mCustomScrollbar();
        $(".PlaylistTabView").mCustomScrollbar();

    },

    resetMusicDetailsVisuals: function () {
        $(".timeLeft hrs").hide();
        $(".timeLeft mins").text(" - -  ");
        $(".timeLeft secs").text(" - -");
        $("#musicName").hide();
        $("#musicAlbum").hide();
        $("#SongDuration hrs").hide();
        $("#SongDuration mins").text("- -  ");
        $("#SongDuration secs").text("- -");
        $(".searchBar").hide();
        $("#volumeRange").hide();
    },

    // Hides/shows searchbar
    toggleSearchBar: function () {
        var searchOpen = (($searchBar[0].attributes[$searchBar[0].attributes.length - 1].value.search(/none/) >= 0) ? true : false);
        if (searchOpen) {
            $searchBar.show();
        }
    },

    closeSearchBar: function (params) {
        var on = $SearchToggle[0].attributes[$SearchToggle[0].attributes.length - 1].value
                                                                .search("SearchToggle-On") >= 0;
        if (on) {
            $($SearchToggle)
				.removeClass("SearchToggle-On")
				.addClass("SearchToggle-Off");
            setTimeout(function () {
                $searchBar.hide();
            }, 1000);
        }
    },


    toggleSearchBarIcon: function () {
        eventHandler.toggleSearchBar();
        var on = $SearchToggle[0].attributes[$SearchToggle[0].attributes.length - 1].value
								.search("SearchToggle-On") >= 0;
        if (on) {
            $($SearchToggle)
				.removeClass("SearchToggle-On")
				.addClass("SearchToggle-Off");
            setTimeout(function () {
                $searchBar.hide();
            }, 1000);
        } else {
            $searchBar.val("	");
            $($SearchToggle)
				.removeClass("SearchToggle-Off")
				.addClass("SearchToggle-On");
        }
    },


    toggleActiveRow: function (index, direction) {
        if (direction == 38) {      //  up
            if ($("tr.active").length > 0) {
                $($("tr.active"))
                  .removeClass("active");
                $($('[row-index="' + index + '"]')).addClass("active");
            } else {
                return;
            }
        } else {                    // down
            if ($("tr.active").length > 0) {
                $($("tr.active"))
                  .removeClass("active");
                $($('[row-index="' + index + '"]')).addClass("active");
            } else {
                $($('[row-index="1"]')).addClass("active");
            }
        }
    },

    findPreviousActiveRowIndex: function () {
        return ($("tr.active")[0].attributes[0].value) - 1;
    },

    findNextActiveRowIndex: function () {
        if ($("tr.active").length > 0) {
            return parseInt($("tr.active")[0].attributes[0].value) + 1;
        } else {
            if (($(".glyphicon-play").length) >= 0) {
                return parseInt($(".glyphicon-play")[0].attributes[1].value);
            } else {
                return 0;
            }
        }
    },

    setKeyboardNavigationListener: function () {
        // NOTE: You have to use scroll and scroll into view .
        if (activeTab && activeTab == "music") {
            document.addEventListener("keydown", function (event) {
                event.preventDefault();// Prevent scrolling if using keyboard .
                if (event.which == 37) { 		 // left
                    return;
                } else if (event.which == 38) {  // up
                    if ($("tr.active").length > 0) {
                        eventHandler.toggleActiveRow(eventHandler.findPreviousActiveRowIndex(), event.which);
                    } else {
                        return;
                    }
                } else if (event.which == 39) {  // right
                    return;
                } else if (event.which == 40) {  // down
                    eventHandler.toggleActiveRow(eventHandler.findNextActiveRowIndex(), event.which);
                } else if (event.which == 13) {  // enter
                    if ($("tr.active").length > 0) {
                        var index = parseInt($("tr.active a")[0].attributes[1].value);
                        preTrackIndex.push(index);
                        PlaybackSync.setCurrentTrack(MetaHelper.parseFileName(meta[index].name));
                        PlaybackSync.Play(index);
                    } else {
                        return;
                    }
                }
            });
        }
    },
    
    setToggleShuffleIconListener: function () {
        $ShuffleToggle.on("click", function (event) {
            var on = event.currentTarget.attributes[1].value.search("ShuffleToggle-On") >= 0;
            if (on) {
                ShuffleOn = false;
                $($ShuffleToggle)
                    .removeClass("ShuffleToggle-On")
                    .addClass("ShuffleToggle-Off");
            } else {
                ShuffleOn = true;
                $($ShuffleToggle)
                    .removeClass("ShuffleToggle-Off")
                    .addClass("ShuffleToggle-On");
            }
        });
    },
    
    setRepeatToggleListener: function () {
        $RepeatToggle.on("click", function (event) {
            var on = event.currentTarget.attributes[1].value.search("RepeatToggle-On") >= 0;
            if (on) {
                var loopTrack = ($("#RepeatToggle span").text() == 1);
                if (!loopTrack) {
                    LoopOn = "track";
                    $("#RepeatToggle span").text("1");
                } else {
                    LoopOn = false;
                    $("#RepeatToggle span").text(" ");
                    $($RepeatToggle)
                        .removeClass("RepeatToggle-On")
                        .addClass("RepeatToggle-Off");
                }
            } else {
                LoopOn = true;
                $($RepeatToggle)
                    .removeClass("RepeatToggle-Off")
                    .addClass("RepeatToggle-On");
            }
        });
    },



    // Todo : Debug this search input durring input its padding it.
    setSearchBarListeners: function () {
        $SearchToggle.on("click", function () {
            setTimeout(function () {
                eventHandler.toggleSearchBarIcon();
            }, 300);
        });
        $searchBar.on('input', function (event) {
            if (this.value.search(/^	(.*)/gmi) >= 0) {
                this.value = "	" + this.value;
            }
        });
    },


    /** @desc - checks if the selected track index is not the same as the current active index */
    isActiveTrack: function (index) {
        if ($(".glyphicon-play")[0] != undefined) {
            var activeIndex = $(".glyphicon-play")[0].attributes[1].value;
            if (typeof index == "number") {
                return activeIndex == index;
            } else {
                return activeIndex == arguments[0].currentTarget.attributes[1].value;
            }
        } else {
            return false;
        }
    },


    toggleActiveTrack: function () {
        //if (Buffering || this.isActiveTrack(arguments[0])) { return; }
        if (Buffering) { return; }
        // Todo : Store the element targets as variables .
        if (typeof arguments[0] == "object") {
            var active = $('[data-index="' + arguments[0].currentTarget.attributes[1].value + '"]').text() > 0;
            var otherActive = $($(".glyphicon-play")).length > 0;
            if (!!active) {
                (!otherActive) ? null : (function () {
                    $($(".glyphicon-play"))
                     .text($(".glyphicon-play")[0].attributes[1].value)
                     .removeClass("glyphicon-play")
                     .removeClass("glyphicon")
                })()
                $($('[data-index="' + arguments[0].currentTarget.attributes[1].value + '"]'))
					.text("")
					.addClass("glyphicon")
					.addClass("glyphicon glyphicon-play");
            } return;
        } else {
            var active = $('[data-index="' + arguments[0] + '"]').text() > 0;
            var otherActive = $($(".glyphicon-play")).length > 0;
            if (!!active) {
                (!otherActive) ? null : (function () {
                    $($(".glyphicon-play"))
                     .text($(".glyphicon-play")[0].attributes[1].value)
                     .removeClass("glyphicon-play")
                     .removeClass("glyphicon")
                })()
                $($('[data-index="' + arguments[0] + '"]'))
					.text("")
					.addClass("glyphicon")
					.addClass(" glyphicon-play");
            } return;
        }
    },


    setContextMenuListener: function () {
        // chrome.contextMenus.onClicked.addListener(function (menuItem) {
        //     if (document.hasFocus()) {
        //         removeContextMenuItem(); // Empty param = All
        //         if (CurrentTrack != null && CurrentTrack.name == PlaybackSync.parseFileName(meta[parseInt(menuItem.menuItemId)].name))
        //                                                                 { return; }
        //         nextPlaybackIndex.push(parseInt(menuItem.menuItemId));
        //     }
        // });
    },

    showtablistFull: function () {
        $($(".row"))[0].style.marginLeft = "-15px";
        $($(".row"))[0].style.marginRight = "-15px";
        $($(".row"))[0].style.width = "830px";
        $($(".tablist-half-open")[0])
          .removeClass('tablist-half-open')
          .addClass('tablist-open');

    },

    hidetablistFull: function () {
        $($(".row"))[0].style.width = "139%";
        $($(".row"))[0].style.marginLeft = "-285px";
        $($(".row"))[0].style.marginRight = "-15px";
        $($(".tablist-open")[0])
          .removeClass('tablist-open')
          .addClass('tablist-closed');

    },

    toggletablistHalf: function () {
        $($(".row"))[0].style.width = "139%";
        $($(".row"))[0].style.marginLeft = "-285px";
        $($(".row"))[0].style.marginRight = "-15px";
        $($(".tablist-half-open")[0]).toggleClass('tablist-half-closed');
        $($(".tablist-half-closed")[0]).toggleClass('tablist-half-open');

    },

    navigationListener: function () {
        // navigation bar
        $($("div.left-side ul")[0]).on('mouseleave', function (event) {
            if (activeTab == "online" || activeTab == "video") {
                if ($($(".tablist-half-open")).length > 0) {
                    eventHandler.toggletablistHalf();
                    $($(".tablist-half-closed")[0]).removeClass(".tablist-half-open");
                }
            }
        });
        // music tab
        $($("div.left-side ul li:nth-child(1)")[0]).on('click', function (event) {
            eventHandler.closeSearchBar();
            if (event.which == 1)
                event.stopPropagation();
            if (activeTab == "online" || activeTab == "video") {
                activeTab = "music";
                eventHandler.showtablistFull();
            }
        });
        // playlist tab
        $($("div.left-side ul li:nth-child(2)")[0]).on('click', function (event) {
            eventHandler.closeSearchBar();
            if (event.which == 1)
                event.stopPropagation();
            $($("#videPlayer")[0]).hide();
            if (activeTab == "online" || activeTab == "video") {
                activeTab = "playlist";
                eventHandler.showtablistFull();
            }
        });
        // online tab
        $($("div.left-side ul li:nth-child(3)")[0]).on('click', function (event) {
            eventHandler.closeSearchBar();
            if (event.which == 1)
                event.stopPropagation();
            $($("#videPlayer")[0]).hide();
            if (activeTab != "online") {
                activeTab = "online";
                eventHandler.hidetablistFull();

                if ($($(".tablist-closed")[0]).length > 0) {

                    $($(".tablist-closed")[0])
                      .removeClass("tablist-closed")
                      .addClass("tablist-half-closed");

                    $($(".SearchToggle-On"))
                      .removeClass("SearchToggle-On")
                      .addClass(".SearchToggle-Off");
                } else {
                    eventHandler.toggletablistHalf();
                }
            }
        });
        // sync tab
        $($("div.left-side ul li:nth-child(4)")[0]).on('click', function (event) {
            eventHandler.closeSearchBar();
            if (event.which == 1)
                event.stopPropagation();
            $($("#videPlayer")[0]).hide();
            if (activeTab == "online" || activeTab == "video") {
                activeTab = "sync";
                eventHandler.showtablistFull();
            }
        });
        // video tab
        $($("div.left-side ul li:nth-child(5)")[0]).on('click', function (event) {
            eventHandler.closeSearchBar();
            if (event.which == 1)
                event.stopPropagation();
            $($("#videPlayer")[0]).show();
            if (activeTab != "video") {
                activeTab = "video";
                eventHandler.hidetablistFull();
                $($(".tablist-closed")[0])
                    .removeClass("tablist-closed")
                    .addClass("tablist-half-closed");
                $($(".SearchToggle-On"))
                    .removeClass("SearchToggle-On")
                    .addClass(".SearchToggle-Off");
            }
        });
        // search tab event 
        $($("div.left-side ul li:nth-child(6)")[0]).on('click', function (event) {
            if (event.which == 1)
                event.stopPropagation();
            if (activeTab == "online" || activeTab == "video") {
                activeTab = "music";
                eventHandler.showtablistFull();
            }
        });

        $($(".tablist-half-open")[0]).on('mouseenter', function (event) {
            if (event.which == 1)
                eventHandler.showtabblistHalf();
        });

        $($(".tablist-half-open")[0]).on('mouseleave', function (event) {
            if (event.which == 1)
                setTimeout(function () {
                    if ($($(".tablist-half-open")).length > 0) {
                        eventHandler.toggletablistHalf();
                    }
                }, 5000);
        });
        // hoverslide
        $($(".hoverSlide")[0]).on('mouseenter', function (event) {
            $($(".tablist-half-closed")[0]).toggleClass('tablist-half-open');
            $($(".tablist-half-open")[0]).toggleClass('tablist-half-closed');
        });
        $(document).on('mouseleave', function () {
            if (activeTab == "video" || activeTab == "online") {
                $($(".tablist-half-open")[0])
                  .removeClass('tablist-half-open')
                  .addClass('tablist-half-closed');
            }
        });

        PlaybackSync.SetDefaultPosterImage();
    },


    /**
     * @desc - Sets listeners for all the elements
     */
    setListenersForAll: function () {
        this.setTimeController();
        this.setContextMenuListener();
        this.setAppStateListeners();
        this.resetMusicDetailsVisuals();
        this.setKeyboardNavigationListener();
        this.setSearchBarListeners();
        this.setRepeatToggleListener();
        this.setToggleShuffleIconListener();
        this.setVolControlListener();
        this.setNotification();
        this.setPlaybackListeners();
        this.setTestingListeners(); // remove me
    }
};
