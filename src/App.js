import React, {Component} from 'react';
import Chatkit from '@pusher/chatkit-client';
import './index.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import { testToken, instanceLocator } from './config'
import NewRoomForm from './components/NewRoomForm';

export class App extends Component {
  constructor() {
    super()
    this.state = {
       messages: [],
       joinableRooms: [],
       joinedRooms: [],
       roomId: null
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
        instanceLocator,
        userId: 'test_user_01',
        tokenProvider: new Chatkit.TokenProvider({
          url: testToken
        })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser;
      this.getRooms();

    })
    .catch(error => {
      console.error("error:", error);
    })
  }

  getRooms(){
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
            joinableRooms,
            joinedRooms: this.currentUser.rooms
        })
      })
      .catch(err => console.log('error on joinableRooms: ', err))
  }

  subscribeToRoom(roomId){
    this.setState({messages: []});

    this.currentUser.subscribeToRoomMultipart({
      roomId: roomId,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [
              ...this.state.messages, 
              {text: message.parts[0].payload.content, senderId: message.senderId, id: message.id}]
          })
        }
      }
    }).then(room => {
      this.setState({roomId: room.id})
      this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room: ', err));
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text: text,
      roomId: this.state.roomId
    })
  }

  createRoom(name){
    this.currentUser.createRoom({name})
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error with createRoom: ', err))
  }

  render() {
    return (
      <div className="app">
        <RoomList 
          roomId={this.state.roomId}
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} 
        />
        <MessageList 
          messages={this.state.messages}
          roomId={this.state.roomId}
        />
        <SendMessageForm 
          disabled={!this.state.roomId}
          sendMessage={this.sendMessage}
        />
        <NewRoomForm createRoom={this.createRoom} />
    </div>
    )
  }
}



export default App;
