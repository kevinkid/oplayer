
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
