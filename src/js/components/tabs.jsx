
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

// REMOVE ME
(function () {
  console.info('tabs');
})();
