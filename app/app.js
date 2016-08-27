var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var PureRenderMixin = require('react-addons-pure-render-mixin');

var browserHistory = ReactRouter.browserHistory;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var samples = require('./sample-data');

var App = React.createClass({
  getInitialState: function(){
    return {
      "humans":{},
      "stores": {}
    }
  },
  loadSampleData: function(){
    this.setState(samples);
  },
  // User navigates to a /conversation/
  componentWillMount: function(){
    if('human' in this.props.params){
      this.loadSampleData();
    }
  },
  render: function(){
    return(
      <div>
        <div id="header"></div>
        <button onClick={this.loadSampleData}>Load Sample Data</button>
        <div className="container">
          <div className="column">
            <InboxPane humans={this.state.humans}/>
          </div>
          <div className="column">
            {this.props.children || "Select a Conversation from the Inbox"}
          </div>
          <div className="column">
            <StoresPane stores={this.state.stores} />
          </div>
        </div>
      </div>
    )
  }
});

var InboxPane = React.createClass({
  renderInboxItem: function(human){
    return <InboxItem key={human} index={human} details={this.props.humans[human]} />;
  },
  render: function(){
    return(
      <div id="inbox-pane">
        <h1>Inbox</h1>
        <table>
          <thead>
            <tr>
              <th>Chat Received</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.humans).map(this.renderInboxItem)}
          </tbody>
        </table>
      </div>
    )
  }
});

var InboxItem = React.createClass({
  mixins: [PureRenderMixin],
  sortByDate: function(a, b){
    return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
  },
  messageSummary: function(conversations){
    var lastMessage = conversations.sort(this.sortByDate)[0];
    return lastMessage.who + ' said: "' + lastMessage.text + '" @ ' + lastMessage.time.toDateString();
  },
  render: function(){
    return (
      <tr>
        <td><Link to={'/conversation/' + encodeURIComponent(this.props.index)}>{this.messageSummary(this.props.details.conversations)}</Link></td>
        <td>{this.props.index}</td>
        <td>{this.props.details.orders.sort(this.sortByDate)[0].status}</td>
      </tr>
    )
  }
})

var ConversationPane = React.createClass({
  loadConversationData: function(human){
    this.setState({conversation: samples.humans[human].conversations});
  },
  // Handle when User navigates / to /conversation/:human
  componentWillMount: function(){
    this.loadConversationData(this.props.params.human);
  },
  // Handle when User navigates /conversations/Rami to /conversation/Jeremy
  componentWillReceiveProps: function(nextProps){
    this.loadConversationData(nextProps.params.human);
  },
  renderMessage: function(message){
    return <Message who={message.who} text={message.text} key={message.time.getTime()} />
  },
  render: function(){
    return(
      <div id="conversation-pane">
        <h1>Conversation</h1>
        <h3>{this.props.params.human}</h3>
        <div id="messages">
          {this.state.conversation.map(this.renderMessage)}
        </div>
      </div>
    )
  }
})

var Message = React.createClass({
  mixins: [PureRenderMixin],
  render: function(){
    return <p>{this.props.who} said: "{this.props.text}"</p>;
  }
})

var StoresPane = React.createClass({
  renderStore: function(store){
    return <Store key={store} index={store} details={this.props.stores[store]} />
  },
  render: function(){
    return (
      <div id="stores-pane">
        <h1>Stores & Oven</h1>
        <ul>
          {Object.keys(this.props.stores).map(this.renderStore)}
        </ul>
      </div>
    )
  }
})

var Store = React.createClass({
  mixins: [PureRenderMixin],
  getCount: function(status){
    return this.props.details.orders.filter(function (n) { return n.status == status}).length;
  },
  render: function(){
    return (
      <li>
        <p>{this.props.index}</p>
        <p>Orders Confirmed: {this.getCount("Confirmed")}</p>
        <p>Orders In The Oven: {this.getCount("In The Oven")}</p>
        <p>Orders Delivered: {this.getCount("Delivered")}</p>
      </li>
    )
  }
})

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/conversation/:human" component={ConversationPane}></Route>
    </Route>
  </Router>, document.getElementById("main"));
