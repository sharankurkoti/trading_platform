import React, { useState } from 'react';
import axios from 'axios';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', { message: input });
      const aiMessage = { from: 'ai', text: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: 'Sorry, something went wrong.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      right: 20,
      zIndex: 9999,
      width: open ? 320 : 60,
      height: open ? 450 : 60,
      transition: 'all 0.3s ease-in-out',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      borderRadius: open ? 10 : '50%',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: 24,
            borderRadius: '50%',
            cursor: 'pointer'
          }}
        >
          💬
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{
            padding: 10,
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <strong>AI Assistant</strong>
            <button onClick={() => setOpen(false)} style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: 18,
              cursor: 'pointer'
            }}>✖</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 10,
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', marginBottom: 8 }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: msg.from === 'user' ? '#d1e7dd' : '#f1f1f1',
                  padding: 8,
                  borderRadius: 6,
                  maxWidth: '80%',
                  wordWrap: 'break-word'
                }}>
                  <strong>{msg.from === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: 10, borderTop: '1px solid #ccc' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                marginTop: 8,
                width: '100%',
                padding: 8,
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
