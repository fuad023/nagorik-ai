import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { secrets } from '../secrets';
import '../styles/Chatbot.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    image?: string; 
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm your Nagorik-AI assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleChatbox = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() && !selectedImage) return;

        const contentText = inputValue.trim() || 'Uploaded an image';
        const imageToSend = selectedImage;

        const newUserMsg: Message = {
            id: Date.now(),
            text: contentText,
            sender: 'user',
            timestamp: new Date(),
            image: imageToSend || undefined
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setSelectedImage(null);
        setIsTyping(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${secrets.backendEndpoint}/api/v1/chatbot/message`, {
                message: contentText,
                image: imageToSend // Base64 string
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const botResponse: Message = {
                id: Date.now() + 1,
                text: response.data.reply || "I'm sorry, I couldn't process that request.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            
        } catch (error: any) {
            console.error("Chat API Error:", error);
            const serverReply = error.response?.data?.reply || "My connection to the AI matrix was interrupted. Ensure the GROQ_API_KEY is configured.";
            
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: serverReply,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
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
                                {msg.image && (
                                    <img src={msg.image} alt="Upload preview" className="img-fluid rounded mb-2" style={{ maxHeight: '150px' }} />
                                )}
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                <small className={`d-block text-end mt-1 ${msg.sender === 'user' ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="d-flex w-100 justify-content-start">
                            <div className="px-3 py-2 shadow-sm bg-white text-dark" style={{ borderRadius: '18px', borderBottomLeftRadius: '4px' }}>
                                <small className="text-muted fst-italic">Thinking...</small>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-top-0 px-3 py-3" style={{ borderBottomLeftRadius: '1.2rem', borderBottomRightRadius: '1.2rem' }}>
                    
                    {/* Image Preview Thumbnail */}
                    {selectedImage && (
                        <div className="position-relative d-inline-block mb-2">
                            <img src={selectedImage} alt="Selected" className="rounded shadow-sm" style={{ height: '50px', objectFit: 'cover' }} />
                            <button 
                                type="button" 
                                className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle p-0" 
                                style={{ width: '20px', height: '20px' }}
                                onClick={() => setSelectedImage(null)}
                            >
                                <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-secondary border-opacity-25">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="d-none"
                            onChange={handleImageUpload}
                        />
                        <button 
                            type="button" 
                            className="btn btn-link p-0 text-secondary me-2 text-decoration-none"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach Photo"
                        >
                            <i className="fas fa-paperclip fs-6"></i>
                        </button>

                        <input
                            type="text"
                            placeholder="Describe your issue..."
                            className="form-control border-0 bg-transparent shadow-none px-0"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        
                        <button 
                            type="submit" 
                            className={`btn btn-link p-0 text-decoration-none ${(!inputValue.trim() && !selectedImage) || isTyping ? 'text-muted' : 'text-primary'}`} 
                            disabled={(!inputValue.trim() && !selectedImage) || isTyping}
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
