/**
 * @desc - visualizes the music playback
 * @todo - fix the memory leak in here
 * @refs - [  https://developers.google.com/web/tools/chrome-devtools/memory-problems/  ]
 * @refs - [  https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/  ]
 * @todo - write something to level up the bars during animation.
 * @todo - write something to make sure the bars come down after playback is paused or stopped
 * @todo - Reduce animation by blocking a frame request.
 */
'use strict';


var isIntialPlay = true,
	musicBarAnimation;

var canvas = document.getElementById("virtualizer"),
	canWidth = canvas.width,
	canHeight = canvas.height,
	meterWidth = 3,
	gap = 6,
	capHeight = 0,
	capStyle = '#fff',
	meterNum = 600 / (2),
	capYPositionArray = [];

var cContext = canvas.getContext("2d");

var colors = [
	"#F95B34", "#F95B34", "#f96b49", "#f96b49",
	"#fa7b5d", "#fa7b5d", "#fa8c71", "#fa8c71"
	/*red*/,
	"#EE3E64", "#EE3E64", "#ef5173", "#ef5173",
	"#f16483", "#f16483", "#f37792", "#f37792"
	/*pink*/,
	"#F36283", "#F36283", "#f4718f", "#f4718f",
	"#f5819b", "#f5819b", "#f691a8", "#f691a8"
	// /*pink*/,
	// "#FF9C34","#FF9C34", "#ffa548","#ffa548",
	// "#ffaf5c","#ffaf5c", "#ffb970","#ffb970"
	/*orange*/,
	"#EBDE52", "#EBDE52", "#d3c749", "#d3c749",
	"#bcb141", "#bcb141", "#a49b39", "#a49b39"
	/*yellow & greens*/,
	"#B7D84B", "#B7D84B", "#a4c243", "#a4c243",
	"#92ac3c", "#92ac3c", "#809734", "#809734"
	/*blues*/,
	"#0875c9", "#0875c9", "#0769b4", "#0769b4",
	"#065da0", "#065da0", "#05518c", "#05518c"
	/*indigo*/,
	"#330099", "#330099", "#4719a3", "#4719a3",
	"#5b32ad", "#5b32ad", "#704cb7", "#704cb7"
	/*violet*/,
	"#551a8b", "#551a8b", "#4c177d", "#4c177d",
	"#44146f", "#44146f", "#3b1261", "#3b1261"
];



/**
 * @desc - Animates the music bars
 */
function AnimateBars(_analyser) {
    var array = new Uint8Array(_analyser.frequencyBinCount);
    _analyser.getByteFrequencyData(array);
    var step = Math.round(array.length / meterNum);
    cContext.clearRect(0, 0, canWidth, canHeight);
    if (player.state) {
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step] - 140;
            if (capYPositionArray.length > Math.round(meterNum)) {
                capYPositionArray.push(value);
            }
            cContext.fillStyle = colors[i];// capstyle
            if (value < capYPositionArray[i]) {
                cContext.fillRect(i * gap, canHeight - (--capYPositionArray[i]),
				meterWidth, capHeight);
            } else {
                cContext.fillRect(i * gap, canHeight - value + capHeight, meterWidth, canHeight + 170);
            }
            cContext.fillStyle = colors[i];
            cContext.fillRect(i * gap, canHeight - value + canHeight, meterWidth, canHeight);
        }
    }
    requestAnimationFrame(function () {
        AnimateBars(_analyser);
    });
}

/**
 * @desc -reduce framerequest .
 */
function blockAnimationFrame() {




}


/**
 * @desc - Music Bars animation controller .
 */
function oVirtualize(_analyser) {
    AnimateBars(_analyser);
}
