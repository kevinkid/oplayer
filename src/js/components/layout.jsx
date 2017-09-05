// TODO : Learn javascript classes .
// @docs : https://facebook.github.io/react/
var TableHeaders = {
      title:'Title',
      artist:'Artist',
      album:'Album',
      duration:'Duration'
    },
    MenuItems: {
      first: 'Music',
      second: 'Playlist',
      third: 'Online',
      fourth: 'Sync'
    };


                  // TABS  //

// TODO: Turn this into a react router .
var MenuList = React.createClass({
  render: (
    <ul>
      <li>
        <a ng-click="tabCtrl.setView(1)" onClick={this.changeView} class="localTab">{MenuItems.first}</a>
      </li>
      <li>
        <a ng-click="tabCtrl.setView(2)" onClick={this.changeView} class="playlistTab">{MenuItems.second}</a>
      </li>
      <li>
        <a ng-click="tabCtrl.setView(3)" onClick={this.changeView} class="onlineTab">{MenuItems.third}</a>
      </li>
      <li>
        <a ng-click="tabCtrl.setView(4)" onClick={this.changeView} class="SyncTab">{MenuItems.fourth}</a>
      </li>
    </ul>
  ),
  // NOTE: The activeView property should be the same name as the target component names .
  changeView: function () {
    this.state.activeView = 'musicList';
  },
  componentWillUpdate: function (prop) {
    // before
     console.log('%c component menulist updated !','color:lightgreen;');
     if(!this.state.aciveView = prop.activeView) {
       console.info('Same tab navigation');
     } else {
       return;
     }
  },
  componentDidUpdate: function (prop) {
    // after
    console.log('%c component menulist updated !','color:lightgreen;');
    if(!this.state.aciveView = prop.activeView) {
      ReactDOM.render(React.createElement(self[prop.activeView.toString()],document.getElementById('left-side') ));
    } else {
      return;
    }
  },
  componentwillRecieveProps: function (_new) {
    // prop changes, doesnt changes ui
    if(!this.state.aciveView = prop.activeView) {
      console.warn('%c component menulist props updated !','color:lightgreen;');
    } else {
      return;
    }
  }

});


                  //  VIEWS //

// Table view
var MusicTabView = React.createClass({
  render: (
    <div class="LocalTabView" ng-show="tabCtrl.getView()==1" id="wlistLinkWindow_contentBorder" class="mui-windowContentBorder">
      <div id="wlistLinkWindow_contentWrapper" class="mui-windowContentWrapper">
          <div id="wlistLinkWindow_content" class="mui-windowContent pad" style="padding: 0px; overflow: auto;">
            <div class="table-top">
                ReactDOM.render(theaders,this);
              </div>
              <div id="wlistLinklist1" class="mui-list">
                ReactDOM.render(tbody,this);
                <table id="table" cellspacing="0" cellpadding="5" style="position: relative;width:565px;">
                    <tbody id="track-list" class="track-list">
                      if (meta.length>0) {
                        ReactDOM.render();
                      } else {
                        {""}
                      }
                    </tbody>
                    <tfoot>
                    </tfoot>
                  </table>
              </div>
          </div>
      </div>
  </div>,document.getElementById('tabsView')),
  // Music list search
  search : function () {

  }
});


// Table headers
var theaders = React.createClass({
  render: (
    <span class="hColOne">{TableHeaders.title}</span>
    <span class="hColTwo">{TableHeaders.artist}</span>
    <span class="hColThree">{TableHeaders.album}</span>
    <span  class="hColFour">{TableHeaders.duration}</span>
  )
});

// Table body
var tbody = React.createClass({
  render: (
    <tbody id="track-list" class="track-list">
      if (meta.length>0) {
        // meta array
        this.state.metaList.map(function (meta, idx, list) {
          ReactDOM.render(tableRecords,{ MetaProp:meta },this);
        }
      } else {
        {""}
      }
    </tbody>
  ),
  //search songs
  search: function () {

  },
  componentWillUpdate: function (prop) {
     console.log('%c component TableRecord updated !','color:lightgreen;');
  },
  componentDidUpdate: function (prop) {
    console.log('%c component TableRecord updated !','color:lightgreen;');
  },
  componentwillRecieveProps: function (_new) {
    console.log('%c component TableRecord updated !','color:lightgreen;');
  }
});


// Table rows/collumns
var tableRecords = React.createClass({
  displayMusicInfo: function (ev){
      // TODO: Display music details with album artwork ,...
  },
  render : (
    <tr row-index={MetaProp.trackIndex} style="position: relative; padding-top: 40px;" id="wlistLinklist1_1" onclick={this.displayMusicInfo}>
      <td id="wlistLinklist1_1_1" data-count={SongNum} data-index={MetaProp.trackIndex} class="colOne">{SongNum}</td>
      <td id="wlistLinklist1_1_0" colspan="2" class="colTwo">
        <a class="songTitle" data-trackIndex={MetaProp.trackIndex} style="text-ecoration: none;"  onClick={this.initialisePlayback} title={MetaProp.songTitle}>{MetaProp.songTitle}</a></td>
      <td id="wlistLinklist1_1_1" class="colThree" title="unknown artist">{MetaProp.artist}</td>
      <td id="wlistLinklist1_1_commands" class="colFour" title="unknown album">{MetaProp.album}</td>
      <td id="wlistLinklist1_1_1" class="colFive">
        <span id="min">{MetaProp.duration}</span>
      </td>\
    </tr>
  ),
  initialisePlayback: function (ev) {
    // Set listeners during display .
    ev.stopPropagation();
    Player.AttachPlayer(ev.currentTarget.attributes[1].value,this);
  },
  // keep track of components state .
  componentWillUpdate: function (prop) {
     console.log('%c component TableRecord updated !','color:lightgreen;');
  },
  componentDidUpdate: function (prop) {
    console.log('%c component TableRecord updated !','color:lightgreen;');
  },
  componentwillRecieveProps: function (_new) {
    console.log('%c component TableRecord updated !','color:lightgreen;');
  }

});



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



// Online view
var OnlineTabView = React.createClass({
  render: (
    <div class="OnlineTabView" ng-show="tabCtrl.getView()==3" id="wlistLinkWindow_contentBorder">
      <webview class="webview" style="width:750px;" src="https://soundcloud.com"/>
    </div>
  ),
  onResize: function () {
    // Resize the browser when the menulist is closed .
  }
});


// Sync view
var SyncTabView = React.createClass({
  render: (
    <div id="SyncTabView" class="SyncTabView" ng-show="tabCtrl.getView()==4">
      <center>
        <a id="installBtn" href="#">install</a>
        <br>
          <a onclick="chrome.webstore.install('https://chrome.google.com/webstore/detail/itemID',function(){
            console.log('successfull install .');
            },function () {
              console.log('Error install');
            })">Try </a>
      </center>
    </div>
  ),
  clickHandler: function () {

  }
});


function RenderLayout() {
  if(jQuery) {

      ReactDOM.render(React.createElement(MenuList,document.getElementById('left-side') ));
      ReactDOM.render(React.createElement(MusicTabView,document.getElementById('left-side') ));// Music list render .

    } else { console.warn(' You dont have jQuery .'); }

}


// REMOVE ME
(function () {
  console.info('layout');
})();
