
// Playlist view
var PlaylistTabView = React.createClass({
  render: (
      <div class="PlaylistTabView"  ng-show="tabCtrl.getView()==2">
        <p style="color:grey;background-color: white;">
        <center>
            <b>Noise Reduction : </b><input type="checkbox" id="noiseReduction">
            <br>
            <b>CrossFade : </b><input type="checkbox" id="crossFade">
            <br>
            <div id="EqualizeWrap" class="EqualizeWrap" style="border: 1px solid black; width: 80%; height: 40%;border-radius: 5px;">

              <div style="float: left; padding:10px;position: absolute;">
                <b>Equalizer : </b><input type="checkbox" id="equalize">
              </div>
              <br>

              <span style="color:gray;position:absolute;margin-top:-10px;margin-left:10%;float: right;cursor:default;">Frequency ranges in kilo Hz</span>

              <div id="Equalize" class="row Equalize" >

                <div class="freq-1 col-xs-1 col-sm-1 col-md-1">
                  <b >2.5</b>
                  <input id="256hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

                <div class="freq-2 col-xs-1 col-sm-1 col-md-1">
                  <b >5.1</b>
                  <input id="512hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

                <div class="freq-3 col-xs-1 col-sm-1 col-md-1">
                  <b >1k</b>
                  <input id="1024hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

                <div class="freq-4 col-xs-1 col-sm-1 col-md-1">
                   <b >2k</b>
                  <input id="2048hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

                <div class="freq-5 col-xs-1 col-sm-1 col-md-1">
                    <b >4k</b>
                  <input id="4096hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

                <div class="freq-6 col-xs-1 col-sm-1 col-md-1">
                  <b >8k</b>
                  <input id="8192hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

                <div class="freq-7 col-xs-1 col-sm-1 col-md-1">
                  <b >16k</b>
                  <input id="16384hz" step="0.0001" type="range" min="-1" max="1" value="0">
                </div>

              </div>

            </div>
            <br>
           <b>Add other muisic folders</b>
           <br>
           <button id="addMediaPath" class="k-button">Add Folder</button>
           <br>
           <input id="diskMusic" type="file" />
           <br>
           <b>Idx : </b><input id="inputIndex" type="number"/>
           <br>
           <button id="getData">Get Meta</button>
           <br>
            <div class="metalog" style="color:black;"></div>
          </center>
      </div>
  ),
  clickHandler: function(){

  }
});
