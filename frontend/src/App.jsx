import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hi! I’m your RMIT Support Assistant. Ask me anything about enrolment, support, or policies.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Server error. Please try again later.' }]);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const resetChat = () => {
    setMessages([
      { sender: 'bot', text: '👋 Hi! I’m your RMIT Support Assistant. Ask me anything about enrolment, support, or policies.' }
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RMIT AI Supporter Chatbot</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            ...styles.message,
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#F1F0F0'
          }}>
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
        <button onClick={resetChat} style={styles.resetButton}>Reset</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: 600,
    margin: '30px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#001F42'
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    height: 400,
    overflowY: 'auto',
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  message: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: 16,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  inputBox: {
    display: 'flex',
    marginTop: 10,
    gap: 10
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16
  },
  sendButton: {
    padding: '10px 16px',
    backgroundColor: '#001F42',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },
  resetButton: {
    padding: '10px 12px',
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  }
};

export default App;
