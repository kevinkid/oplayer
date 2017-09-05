// TODO : Learn javascript classes .
// @docs : https://facebook.github.io/react/

var num = 0,
    headers = [ "Book", "Author", "Language", "Published", "Sales" ],
    data = [
      ["The Lord of the Rings", "J. R. R. Tolkien", "English", "1954–1955", "150 million"],
      ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "French", "1943", "140 million"],
      ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "English", "1997", "107 million"],
      ["And Then There Were None", "Agatha Christie", "English", "1939", "100 million"],
      ["Dream of the Red Chamber", "Cao Xueqin", "Chinese", "1754–1791", "100 million"],
      ["The Hobbit", "J. R. R. Tolkien", "English", "1937", "100 million"],
      ["She: A History of Adventure", "H. Rider Haggard", "English", "1887", "100 million"]
    ];
var heading = React.createElement("h2", null, "Welcome , ", "");
var list = React.DOM.ul({
  id: "trackList",
  style: {
    background: 'transparent',
    color: 'red',
    listStyle: 'none'
  }
});
var defaultTabView = React.DOM.div({
  id:'defaultTab',
  style: {
    background:'yellow',
    width: '500px',
    height: '200px'
  },
  onClick: changeBackground
},'Main Tab View');

var nextTabView = React.DOM.div({
  id:'nextTab',
  style: {
    background:'green',
    width: '500px',
    height: '200px'
  }
}, 'next tab view ');


// React custom component
var textArea = React.createClass({
  propTypes: {
    text : React.PropTypes.string
  },
  textChange : function (ev) {
      this.setState({
        text: ev.target.value
      });
  },
  render : function () {
    this.state = {
      text: "bigkevzs"
    };
    onChange = this.textChange;
    return React.DOM.div(null,
      React.DOM.textarea({
        defaultValue: this.state.text
      }),
      React.DOM.h3(null,this.state.text.length)
      );
  },
  componentWillUpdate: function (prop) {
     console.log('%c component updated !','color:green;');
  },
  componentDidUpdate: function (prop) {
    console.log('%c component updated !','color:pink;');
    // ReactDOM.render(React.createElement(textArea,{ text: prop.text }),document.getElementById("root"));
  },
  componentwillRecieveProps: function (_new) {
    console.log('%c component props !','color:red;');
    this.state({
      text: _new
    });
  },
  getInitialState: function() {
    return { text: this.props.text};
  }
});



function changeBackground() {
  console.log('changing background .');
}


// TABS VIEWS //




// NOTE:  tabsView <=> target tabs view
var songList = React.createClass({
  render: function() {
    return;
  }
});

// rendering only the table headers
var theaders = React.createClass({ render: function() {
  return ( React.DOM.table(null,
    React.DOM.thead(null, React.DOM.tr(null,
      this.props.headers.map(function(title) {
        return React.DOM.th(null, title);
      }) )
    ) )
  ); }
});

// Table
var table = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.initialData,
      descending:false,
      sortBy:false,
      edit:null,
      search: true
    };
  },
  propTypes: {
    id: React.PropTypes.string
  },
  render: function() {
    return (
      React.DOM.tbody({
          id: 'track-list',
          className: 'track-list',
          style: {
            position: 'relative',
            padding: '40px 0',
            width: '100px'
          },
          id: 'wlistLinklist1_1'
        },
        this.state.data.map(function (row, idx) {
          return (
            React.DOM.tr({
              key: idx,
              className:'head'
            },
            row.map(function (cell, idx) {
              return React.DOM.td({
                 key: idx ,
                 id:'wlistLinklist1_1_1',
                 colSpan:"2"
               }, cell);
            })));
        })
      ));
  },
  search: function () {
      if (!this.state.search) {
        return;
      } else {
        return (React.DOM.tr({onChange: this._search},
              this.props.headers.map(function(_ignore, idx) {
                return React.DOM.td({key: idx},
                        React.DOM.inpuvisut({
                          type: 'text',
                          'data-idx': idx
                        }) );
              })));
      }
  }

});

// NOTE: playlisttab
var _playlistTabView = React.createClass({
  render: function (){
    return(
      React.DOM.p({

      }),
      React.DOM.center({

      })
  );
  }
});

// Render the default page .
if(jQuery) {

     _heading = ReactDOM.render(heading, document.getElementById('SyncTabView'));

     _textarea =  ReactDOM.render(React.createElement(textArea,{ text: "bigkevzs" }),document.getElementById("SyncTabView"));

    self._list = ReactDOM.render(list, document.getElementById("SyncTabView"));

    self._defaultTab = ReactDOM.render(defaultTabView, document.getElementById("SyncTabView"));

    // The big table
    // self._table = ReactDOM.render( React.createElement(table, { headers: headers, initialData: data }),
                                  // document.getElementById("SyncTabView") );

    $("#add").on('click',function (){
        console.log('Adding list item');
        self._listItem = ReactDOM.render(React.createElement(listItem,{title:"Song title "+(num++) }),
                                    document.getElementById('SyncTabView'));
    });

    // Change  tab view
    $("#prev").on('click', function(){
      self._defaultTabView = ReactDOM.render(defaultTabView,document.getElementById('view'));
      ReactDOM.render( React.createElement(table, { headers: headers, initialData: data }),
                                      document.getElementById("SyncTabView") );
    });

    $("#next").on('click', function(){
      self._nextTabView = ReactDOM.render(nextTabView, document.getElementById("SyncTabView"));
    });

} else { console.warn(' You dont have jQuery .'); }
