import React, {Component} from 'react';
import Chatkit from '@pusher/chatkit-client';
import './index.css';
import Title from './components/Title';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import { testToken, instanceLocator, userId, roomId } from './config'

const DUMMY_DATA = [
  // {
  //   senderId: "perborgen",
  //   text: "who'll win?"
  // },
  // {
  //   senderId: "janedoe",
  //   text: "who'll win?"
  // }
]

export class App extends Component {
  constructor() {
    super()
    this.state = {
       messages: DUMMY_DATA
    }
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
        instanceLocator,
        userId,
        tokenProvider: new Chatkit.TokenProvider({
          url: testToken
        })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser;
      currentUser.subscribeToRoomMultipart({
        roomId: currentUser.rooms[0].id,
        hooks: {
          onMessage: message => {
            console.log("Received message:", message)
            this.setState({
              messages: [
                ...this.state.messages, 
                {text: message.parts[0].payload.content, senderId: message.senderId, id: message.id}]
            })
          }
        }
      });
    })
    .catch(error => {
      console.error("error:", error);
    })
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text: text,
      roomId: roomId
    })
  }

  render() {
    return (
      <div className="app">
        <Title />
        <MessageList messages={this.state.messages}/>
        <SendMessageForm sendMessage={this.sendMessage} />
    </div>
    )
  }
}



export default App;
