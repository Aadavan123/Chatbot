import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../src/assets/ChatInterface.css'; // Import the CSS for styling

const ChatInterface = () => {
  const [theme, setTheme] = useState('light'); // Theme state
  const [chatHistory, setChatHistory] = useState([]); // Chat history state
  const [message, setMessage] = useState(''); // Chat message state
  const navigate = useNavigate(); // Initialize navigation

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: 'individual', message }]);
      setMessage('');
    }
  };

  // Navigate to Individual Chat page
  const handleIndividualChatClick = () => {
    navigate('/individualchat'); // Navigate to the IndividualChat page
  };

  return (
    <div className={`chat-interface ${theme}`}>
      {/* Header with theme toggle */}
      <div className="chat-header">
        <h2>Chatbot Interface</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      {/* Chat buttons for Individual and Community */}
      <div className="chat-buttons">
        <button className="chat-button" onClick={handleIndividualChatClick}>Individual Chat</button>
        <button className="chat-button">Community Chat</button>
      </div>

      {/* Chat area with history */}
      <div className="chat-content">
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.type}`}>
              {chat.message}
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
          <input type="file" className="upload-button" />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
