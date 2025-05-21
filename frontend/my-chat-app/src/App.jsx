import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://chatapp-x8da.onrender.com');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [myId, setMyId] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChat((prev) => [...prev, { message, senderId: myId }]);
      socket.emit('send_message', { message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      setMyId(socket.id);
    });

    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('connect');
    };
  }, []);

  return (
    <div className="whatsapp-container">
      <div className="chat-header">WhatsApp Clone</div>
      <div className="chat-box">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.senderId === myId ? 'right' : 'left'}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button className="chat-send">➤</button>
      </form>
    </div>
  );
}

export default App;
