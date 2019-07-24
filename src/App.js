import React from 'react';
import './App.css';
import Title from './components/Title';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';

function App() {
  return (
    <div className="App">
      <Title />
      <MessageList />
      <SendMessageForm />
    </div>
  );
}

export default App;
