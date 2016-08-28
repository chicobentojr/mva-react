import React from 'react';
import Message from './Message';
import autoBind from 'react-autobind';
import samples from '../sample-data';

class ConversationPane extends React.Component {
  constructor(props){
    super(props);
    autoBind(this);
  }
  sortByDateDesc(a, b) {
    return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
  }
  loadConversationData(human) {
    this.setState({conversation: samples.humans[human].conversations});
  }
  // Handle when User navigates / to /conversation/:human
  componentWillMount() {
    this.loadConversationData(this.props.params.human);
  }
  // Handle when User navigates /conversations/Rami to /conversation/Jeremy
  componentWillReceiveProps(nextProps) {
    this.loadConversationData(nextProps.params.human);
  }
  renderMessage(message) {
    return <Message who={message.who} text={message.text} key={message.time.getTime()} />
  }
  render() {
    return(
      <div id="conversation-pane" className="column">
        <h1>Conversation</h1>
        <h3>{this.props.params.human}</h3>
        <div id="messages">
         {this.state.conversation.sort(this.sortByDateDesc).map(this.renderMessage)}
        </div>
      </div>
    )
  }
}

export default ConversationPane;
