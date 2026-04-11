import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';
// Using standard FontAwesome classes if MDBIcons are heavily MDB-dependent
// Or we can keep using MDBIcon if available, but let's stick to standard bootstrap + FA
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm your Nagorik-AI assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChatbox = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');

        // Simulate bot typing and response
        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: "I'm currently a mock assistant! In the future, I'll be able to help you submit reports proactively.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 800);
    };

    return (
        <div className="position-fixed bottom-0 start-0 m-4 z-3 d-flex flex-column-reverse align-items-start chatbot-wrapper">
            
            {/* Toggle Button */}
            <button 
                onClick={toggleChatbox}
                className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center p-0 mt-3 chatbot-toggle-btn"
                style={{ width: '60px', height: '60px', transition: 'all 0.3s' }}
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} fs-4`}></i>
            </button>

            {/* Chatbot Card */}
            <div 
                className={`card shadow-lg border-0 bg-white bg-opacity-75 ${isOpen ? 'd-flex' : 'd-none'}`}
                style={{ 
                    width: '350px', 
                    height: '500px', 
                    maxHeight: '75vh',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '1.2rem',
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                {/* Header */}
                <div className="card-header bg-primary text-white border-bottom-0 d-flex justify-content-between align-items-center px-3 py-3" style={{ borderTopLeftRadius: '1.2rem', borderTopRightRadius: '1.2rem' }}>
                    <div className="d-flex align-items-center">
                        <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-robot text-white"></i>
                        </div>
                        <div className="ms-2">
                            <h6 className="mb-0 fw-bold">Nagorik Assistant</h6>
                            <small className="opacity-75 d-flex align-items-center">
                                <span className="bg-success rounded-circle me-1" style={{ width: '8px', height: '8px' }}></span>
                                Online
                            </small>
                        </div>
                    </div>
                    <button className="btn btn-link text-white p-0 text-decoration-none" onClick={toggleChatbox}>
                        <i className="fas fa-minus"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="card-body overflow-auto d-flex flex-column bg-light bg-opacity-50 chatbot-body-scroll" style={{ gap: '15px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`d-flex w-100 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div 
                                className={`px-3 py-2 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                style={{ 
                                    maxWidth: '85%', 
                                    borderRadius: '18px',
                                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                                    borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <p className="mb-0">{msg.text}</p>
                                <small className={`d-block text-end mt-1 ${msg.sender === 'user' ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-top-0 px-3 py-3" style={{ borderBottomLeftRadius: '1.2rem', borderBottomRightRadius: '1.2rem' }}>
                    <form onSubmit={handleSendMessage} className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-secondary border-opacity-25">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="form-control border-0 bg-transparent shadow-none px-0"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className={`btn btn-link p-0 text-decoration-none ${!inputValue.trim() ? 'text-muted' : 'text-primary'}`} 
                            disabled={!inputValue.trim()}
                        >
                            <i className="fas fa-paper-plane fs-5"></i>
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Chatbot;
