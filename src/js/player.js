/**
 * @author - bigkevin2682@gmail.com
 *  [KEYWORDS]
 *  - pitch : the highness or the lowness of sound intensity.
 *  - intensity : amount of gain in a channel.
 *  - frequency : number of cycle dispacements per second.
 *  - ultrasonic : sound frequency above upper limits beyond human hearing.
 *  - subsonic : sound frequency below low limits beyond human hearning.
 *  - audioRange : the distance the sound can be heard.
 *  - cycles  : number of repeating displacements in the frequency.
 *  - wavelength : distance between successive points in a wave graph.
 *  - amplitude : this is the deepness of a crest on a displacement on a 
 *     frequency curve.
 *  - oscillation : this movement back and forth in a regular rhythm.
 *  - rhythm : strong repeated movement of sound.
 *  - channel : A channel contains one frequency sound wave.
 *  - sample : Number of sounds where each sample represent an aplitude 
 *     stored as an integer or floating number.
 *  - sampleRate : Number of samples per second.
 *  	[FEATURES]
 *  - Playing all file formats .
 *  - local and online synced playlist - creating and saving an online 
 *     playlist saverable and unsavable - maybe they are listening to 
 *     posdcast .
 *  - local and streaming synced playback - playing video or audio via
 *      our proxy stream server without having to be in that website .
 *  - mini size player playing offline music .
 *  - top window - player is always ontop of other windows.
 *  	[USEFUL LINKS]
 *  @docs:  https://developer.chrome.com/extensions/webNavigation  
 *  @docs:  https://developer.chrome.com/extensions/commands 
 *  @docs: http://www.html5rocks.com/en/tutorials/webrtc/basics/  
 *  @docs:  https://www.w3.org/TR/webrtc/  
 *  @docs:  https://developer.chrome.com/apps/app_window  
 *  @docs: https://www.w3.org/TR/webaudio/
 *  @docs: https://www.w3.org/TR/webaudio/#todo-fix-up-this-example.-a-volume-meter-and-clip-detector
 *  @docs: https://developer.mozilla.org/en/docs/Web/API/ScriptProcessorNode
 *  @docs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers
 *  @docs: http://www.bbc.co.uk/education/guides/z7vc7ty/revision/2
 *  @search: https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=sound+computer+science+
*/

'use strict';


/// Globals
var Player,
	ready,
	trackIndex            = [],
	preTrackIndex         = [],
	nextPlaybackIndex     = [],
	MediaDirectoriesList  = [],
	previousPlaybackIndex = [],
	toggleNotification    = false,
	isVedio               = false,
	volHeldDown           = false,
	CurrentTrack          = {},
	Buffering             = false,
	volume				  = 0.01;

// NOTE: This programming model allows for crossfade effect .
Player = function (_state, _track, _repeat, _shuffle, _volume) {
	this.state = _state;
	this.track = _track;
	this.repeat = _repeat;
	this.shuffle = _shuffle;
	this.volume = _volume;
};

Player.prototype.DEFAULTS = app.playerDefauls;

Player.prototype.play = PlaybackSync.Play;

Player.prototype.pause = PlaybackSync.Pause;

Player.prototype.EndAudioPlayback = PlaybackSync.EndAudioPlayback;

Player.prototype.loadTrack = PlaybackSync.loadTrack;

Player.prototype.loadNextTrack = PlaybackSync.loadNextTrack;

Player.prototype.loadPreviousTrack = PlaybackSync.loadPreviousTrack;

Player.prototype.playVideoPlayback = PlaybackSync.PlayVideoPlayback;

Player.prototype.endVideoPlayback = PlaybackSync.EndVideoPlayback;

Player.prototype.pauseVideoPlayback = PlaybackSync.PauseVideoPlayback;

Player.prototype.softReset = PlaybackSync.softReset;

Player.prototype.hardReset = PlaybackSync.hardReset;

Player.prototype.virtualize = PlaybackSync.virsualise;

Player.prototype.AttachPlayer = PlaybackSync.AttachPlayer;

Player.prototype.staticPlayback = PlaybackSync.staticPlayback;

Player.prototype.ControlledPlayback = PlaybackSync.ControlledPlayback;

Player.__proto__.DEFAULTS = {
	REPEAT : app.DEFAULTS.playerDefaults.REPEAT,
	SHUFFLE : app.DEFAULTS.playerDefaults.SHUFFLE,
	VOLUME : app.DEFAULTS.playerDefaults.VOLUME 
};


/** @desc - Initiates the player */
Player.prototype.init = function () {
    self.player = new Player("initial", {}, Player.DEFAULTS.REPEAT, Player.DEFAULTS.SHUFFLE, Player.DEFAULTS.VOLUME);
	self.activeTab = "music";
	app.setPlaybackModes();
	scanner.scan();
	eventHandler.setListenersForAll();
}

/// Initialise the player
new Player().init();
