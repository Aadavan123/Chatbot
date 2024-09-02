import React, { useState, useEffect } from 'react';
import '../src/assets/IndividualChat.css'; // Import the CSS for styling

const IndividualChat = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Theme state
  const [chatHistory, setChatHistory] = useState([]); // Chat history state
  const [message, setMessage] = useState(''); // Chat message state
  const [sidebarVisible, setSidebarVisible] = useState(true); // Sidebar visibility state

  useEffect(() => {
    document.body.className = theme; // Apply theme to body
  }, [theme]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save theme state to localStorage
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: 'individual', message }]);
      setMessage('');
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`chat-container ${theme}`}>
      {/* Header with theme toggle */}
      <div className="chat-header">
        <h2>Individual Chat</h2>
        <button className="chat-theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      {/* Sidebar for chat history */}
      <div className={`chat-sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <div className="chat-sidebar-header">
          <h3>Chat History</h3>
          <button className="chat-sidebar-toggle" onClick={toggleSidebar}>
            {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
        </div>
        <div className="chat-sidebar-content">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.type}`}>
              {chat.message}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main">
        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="chat-send-button">
            Send
          </button>
          <input type="file" className="chat-upload-button" />
        </div>
      </div>
    </div>
  );
};

export default IndividualChat;
