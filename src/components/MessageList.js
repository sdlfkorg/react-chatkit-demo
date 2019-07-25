import React, { Component } from 'react'
import Message from './Message';

export class MessageList extends Component {
  render() {
    return (
      <div className="message-list">
        {this.props.messages.map((message, index) => {
            return (
                <Message key={message.id} username={message.senderId} text={message.text} />
            )
        })}
    </div>
    )
  }
}

export default MessageList
