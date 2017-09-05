
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
