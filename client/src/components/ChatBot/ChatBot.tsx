import React, { useState, useEffect, useRef } from 'react';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardFooter,
  MDBIcon,
} from 'mdb-react-ui-kit';
import api from '../../api';
import './ChatBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your Nagorik-AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Floating Action Button */}
      <button className="chat-fab" onClick={toggleChat} title="Talk to AI">
        <MDBIcon fas icon={isOpen ? 'times' : 'comment-dots'} size="lg" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <MDBCard className="chat-window shadow-lg animate-slide-up">
          <MDBCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="ai-status-dot me-2"></div>
              <span className="fw-bold">Nagorik-AI Assistant</span>
            </div>
            <button className="btn-close btn-close-white" onClick={toggleChat}></button>
          </MDBCardHeader>

          <MDBCardBody className="chat-content">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.text}
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message-bubble ai typing">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </MDBCardBody>

          <MDBCardFooter className="p-3">
            <form onSubmit={handleSend} className="d-flex w-100">
              <input
                type="text"
                className="form-control chat-input"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <MDBBtn color="primary" className="ms-2 send-btn" onClick={() => handleSend()}>
                <MDBIcon fas icon="paper-plane" />
              </MDBBtn>
            </form>
          </MDBCardFooter>
        </MDBCard>
      )}
    </div>
  );
};

export default ChatBot;
