

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
