// @desc: controls the audio output depending on the users specification through the audioprocessing event .

console.log("Requesting the audio worker");
var worker = {
    processor: this.processor,
    handleRequest: function () {
        workerNode.onaudioprocess = function (audioProcessor) {
            console.log("Audio processing started ...");
            audioProcessor.volume = 0;
        }
    },
    startProcessor: function () {

        /*========================*/
        // creating an audio worker
        // Audio worker has to be created with a
        // buffer size which has to be one of the following values
        // [ 256, 512, 1024, 2048, 4096, 8192, 16384 ]

        //@param {Number} - buffer size
        //@param {Number} - number of input channels // max 32
        //@param {Number} - number of output chaneels // max 32
        workerNode = aContxt.createScriptProcessor(1024, 1, 1);
        // [note to self]: check if the buffer size and the bitrate match

        this.processor = workerNode;

        console.log("Worker node :");
        console.dir(workerNode);
        console.log(workerNode.bufferSize);

        // @todo: takes the rest of the code to the Player to manage the user click events

        // @todo: learn what the hell the following attr are in digital sound
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
        }

        // sets the audio output buffer properties using messaging
        // function incommingRequest(ev) {
        // 	if (ev.data instanceOf(Object)) {
        // 		if (ev.data.hasOwnProperty("cliping")) {
        // 			workerNode.cliping = ev.data.cliping
        // 		}
        // 		if (ev.data.hasOwnProperty("volume")) {
        // 			workerNode.volume = ev.data.volume;
        // 		}
        // 		// other properties ...
        // 	}
        // }

        function listen(node) {
            node.onmessage = incommingRequest;
        }

        // listen(workerNode);
        /*========================*/

    },
    startRequestListener: function () {




    }
};


// workeNode.onaudioprocess = function (audioProcessor) {
// 		console.log("Audio processing started ...");
// 		console.log("Volume chaning ...");
// 		audioProcessor.volume = 0;
// 		console.log(audioProcessor);
// 		if (audioProcessor) {
// 		// audio input buffer
// 		var input = audioProcessor.inputBuffer;

// 		// audo output buffer
// 		var output = audioProcessor.outputBuffer;

// 		for (var channel = 0 ; channel < output.numberOfChannels; channel++) {
// 			var inputData = input.getChannelData(channel);
// 			var outputData = output.getChannelData(channel);

// 		}

// 	}else {
// 		console.log("Nothing recieved from the audio processor .");
// 	}
// }

// function onRequest(node) {

// }
