/**
 * @desc - decodes and processes raw binary, performs other proceses as well i.e volume control ...
 */

var playbackQueue = [];
var aContxt = null,// 6 limit per window
    workerNode,
	gainNode,
	bufferSource,
	startTime = 0,
	initialTime = 0,
	pauseTime = 0,
    pauseOffset = 0,
	startOffset = 0,
    seekOffset = 0,
	progressBarInterval,
	progressTimeInterval,
	previouslyPaused = false;

// Note : Sample is a frequency
// Note : Samplerate is change in frequency per sec
var supportedSampleRates = {
    256: true,
    512: true,
    1024: true,
    2048: true,
    4096: true,
    8192: true,
    16384: true
};

var defaults = {
    EqualizerSampleValues: { //  Flat Effect

    },
    CompressionValues: { //  NOTE: This configuration adds noise .
        threshold: -50,
        knee: 40,
        ratio: 12,
        reduction: -20,
        attack: 0,
        release: 0.25
    }
};

// TODO: Convert this processor object into a function .
var processor = {
    // Note : The only effect that we are including this application .
    crossFadeEffect: function () {

    },



    /**
	 * @desc - Reduces the noise in an audio depending on the playback state
	 * @todo : Check if this works for bad qality audio , test track => let me honest let us be real  by. Tyga
	 * @param {Number} - Threshold above which compression takes place
	 * @param {Number} - Knee value representing the range above the threshold where the curve smoothly takes transition to the compressed portion .
	 * @param {Number} - Ratio about of change in dB of the input for 1dB of the output .Meaning a value in range of 1 .
	 * @param {Number} - gain reduction value applied by the compressor
	 * @param {Number} - attack rate of affecting the gain node .
	 * @param {Number} - release time to change the amound to gain by 10dB , meaning in range of 10.
	 */
    NoiseReduction: function (pThreshold, pKnee, pRatio, pReduction, pAttack, pRelease) {

        var compressor = aContxt.createDynamicsCompressor();
        var compression = eval({
            threshold: pThreshold,
            knee: pKnee,
            reduction: pReduction,
            release: pRelease
        }) | defaults.CompressionValues;

        // Error:  These values add more noise .
        compressor.threshold.value = compression.threshold;
        compressor.knee.value = compression.knee;
        compressor.ratio.value = compression.ratio;
        compressor.reduction.value = compression.reduction;
        compressor.attack.value = compression.attack;
        compressor.release.value = compression.release;
        this.isCompressorConnected = false;

        // Note :  Make sure you are connecting once, because multiple connections add noise .
        if (!processor.isCompressorConnected) {
            if (!($noiseReduction[0].checked)) {
                // connect the compressor
                compressor.connect(aContxt.destination);
                bufferSource.connect(compressor);
            } else {
                return;
            }
        } else {
            try {
                // disconnect
                bufferSource.disconnect(compressor);
                compressor.disconnect(aContxt.destination);
            } catch (ex) { return; }
        }
    },



    /**
	 * @desc - Changes the frequency value sample according to a
	 * 				 range the frequency belongs to and the value the user
	 * 				 specifies .
	 */
    Equalize: function (input, output) {
        return;
        var freqBounds = [256, 16384];

        if ($equalize.checked) {

            // Todo : reduce the gain on specific range of samples depending on user settings .
            // loop though all the channels
            for (var channel = 0; channel < output.numberOfChannels; channel++) {

                var inputChannel = input.getChannelData();
                var outputChannel = output.getChannelData();

                // Note : use the samples to implement the equalizer
                for (var sample = 0; sample < inputChannel.length; sample++) {

                    // Todo : Divide the sample in such a way that you have an eqalizer .
                    // This is depending on the range of each sample frequency data .
                    // Todo : Create a method that divides the samples and changes each
                    // Depending on the about that that frequency range amount is supposed
                    // to be output .

                    // Note: This will be called on every change.
                    outputChannel[channel] = Equalizer(sample);

                }
            }


        } else {
            return;
        }
    },



    // Note : The script processor will be replaced by the worker node .
    createProcessor: function () {

        (aContxt.state === "closed") ? ( PlaybackSync.ResetPlayback()) : false;

        /**
         * @param {Number} - buffer size [ 256, 512, 1024, 2048, 4096, 8192, 16384 ]
         * @param {Number} - number of input channels // max 32
         * @param {Number} - number of output chaneels // max 32
         * @note - This is after your have created a buffersource.
         */
        workerNode = aContxt.createScriptProcessor(1024, 1, 1);

        console.log("Worker node :");
        console.dir(workerNode);

        // Note : This event gets called rapidly and is only called once .
        workerNode.onaudioprocess = function (processEv) {

            // console.dir(processEv);

            // Todo : Put statements that add effects here .
            var input = processEv.inputBuffer;
            var output = processEv.outputBuffer;
            // @docs : https://developer.mozilla.org/en/docs/Web/API/ScriptProcessorNode

            // Add equalizer effect if turned on .
            // output = processor.Equalize(input, output);

            // Noise reduction effect .
            // processor.NoiseReduction();

        }

        // Connect the source to the processor
        bufferSource.connect(workerNode);

        // connect the processor to the destination
        workerNode.connect(aContxt.destination);

        /**
		 * [Contant configurations of the processed buffer]
		 * @type {Object}
		 * @property {Number} smoothing how smooth to stransition effects
		 * @property {Number} clipLevel level to consider cliping
		 * @property {Number} clipLag how long to take before effects are made
		 * @property {Number} updating time it takes to update the effects being made.
		 */
        var defaults = {
            "smoothing": 0.9,
            "clipLevel": 0.9,
            "clipLag": 750, // ms
            "updating": 100 // ms
        };

    },

    decodeAudio: function (arBuffer) {
        Buffering = true;
        $LogInfo("Decoding audio ...", 0, null);

        aContxt.decodeAudioData(arBuffer, function (buffer) {

            if (buffer) arBuffer = null;
             PlaybackSync.PlaybackProgressBar();
            // Note : Prevent garbadge collection during pause .
            processor.buffer = buffer;
            processor.start(buffer);
             previouslyPaused = true;

        }, function (error) {
            $LogInfo("Error Decoding audio", 0, null);
            throw new Error({ message: "Error decoding audio" })
        });
    },

    InitializePlayback: function (arBuffer) {
        try {
             PlaybackSync.ResetPlayback();
             CurrentTrack.size = arBuffer.byteLength / 1e6; // [Mbs]
            processor.decodeAudio(arBuffer);
        } catch (ex) { console.error(ex) }
    },

    start: function (buffer) {
        // Note : This impementation has a memory leak , found out where the memory leak is .
        console.log("%c Playback time[ " + startTime + " ]", "color:green");

        // Instanciate a new context if stoped .
        (aContxt.state === "closed" || aContxt == null) ? PlaybackSync.ResetPlayback.call() : false;

        bufferSource = aContxt.createBufferSource();	    // define source

        // create processor
        (aContxt.state === "closed" || aContxt == null) ?  processor.createProcessor.call() : false;

        bufferSource.loop = (typeof LoopOn == "string") ? true : false;

        var analyser = aContxt.createAnalyser(); 			// create analyser

        bufferSource.connect(analyser); 					// source [->] analyser

        analyser.connect(aContxt.destination); 			    // analyser [->] destination

        // set source buffer
        bufferSource.buffer = buffer ? buffer : processor.buffer;

        /** @enum speakers */
        /** @enum discrete */
        aContxt.destination.channelInterpretation = "speakers";

        gainNode = aContxt.createGain(); 					// create gainNode

        bufferSource.connect(gainNode); 					// source [->] gainNode

        gainNode.connect(aContxt.destination); 		        // gain [->] destination

        aContxt.currentTime = startTime; 					// set startTime
        
        initialTime = (previouslyPaused) ? initialTime :  aContxt.currentTime;// set only once at initialization

        pauseOffset += aContxt.currentTime - pauseTime;

        /**
         * @param {Number} - delay time [ms]
         * @param {Number} - starting point to start reading the buffer .
         */
        bufferSource.start(0, startTime % bufferSource.buffer.duration);

        // --------------------------------------------------------
        //  bufferSource.start(0, CurrentTrack.playbackPosition);
        // --------------------------------------------------------

        gainNode.gain.value =  volume;

         CurrentTrack.lastStartTime = startTime;

        bufferSource.onended = processor.onBufferSourceEnded;

         PlaybackSync.PlaybackProgressBar(aContxt.currentTime, bufferSource.buffer.duration);

         CurrentTrack.duration = bufferSource.buffer.duration;

        // virsualise
        // Player.virtualize(analyser); // TODO : uncomemnt me after debug .

        $LogInfo("Playing  ", 0, null);
        Buffering = false;
    },


    end: function () {
        if (bufferSource != undefined && typeof bufferSource == "object") {
            bufferSource.stop(0);
            gainNode.disconnect(aContxt.destination);  
            bufferSource.disconnect(gainNode); 
            bufferSource.disconnect(workerNode);
            aContxt.close();
            // NOTE: Always make sure that you are null these right after there execution .
        }
    },
    
    /**
	 * @desc - Called when playback is finished and on pause events .
	 * @todo: Make sure the context time
	 */
    onBufferSourceEnded: function (ev) {
        console.info("%c BufferSource ended .", "color:lime;");
        // NOTE: Add the seek offset 
        if (bufferSource) { 
            if (bufferSource.buffer.duration <
                    (aContxt.currentTime - (pauseOffset + initialTime + 1) + seekOffset) && (player.state == "playing" || player.state!= "paused")) {
                 PlaybackSync.EndAudioPlayback(false);
            } else {
                if (player.state == "playing" || player.state== "paused") {
                    if (bufferSource.buffer.duration > (aContxt.currentTime - (pauseOffset + initialTime + 1) + seekOffset)) {
                         PlaybackSync.EndAudioPlayback(true);
                    }
                }
            }
        }
    }
};
