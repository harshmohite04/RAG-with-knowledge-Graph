// import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ragService from '../../services/ragService';

// Icons
const LockIcon = () => (
    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)
const PaperClipIcon = () => (
    <svg className="w-5 h-5 text-slate-400 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
)

interface CaseData {
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    description: string;
}

interface ContextItem {
    content: string;
    source?: string;
    metadata?: any;
    score?: number;
}

interface Message {
    id: number;
    sender: string;
    avatar?: string;
    content: string;
    time: string;
    isUser: boolean;
    contexts?: ContextItem[];
}

const CaseChat: React.FC = () => {
    // @ts-ignore
    const { caseData } = useOutletContext<{ caseData: CaseData }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchHistory = async () => {
            if (!caseData?._id) return;
            try {
                const data = await ragService.getHistory(caseData._id);
                if (data.history && Array.isArray(data.history)) {
                    const historyMessages: Message[] = data.history.map((msg: {role: string, content: string}, index: number) => ({
                        id: index, // Simple ID for history
                        sender: msg.role === 'user' ? 'You' : 'AI Assistant',
                        avatar: msg.role === 'assistant' ? 'https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff' : undefined,
                        content: msg.content,
                        time: '', // No timestamp in history yet
                        isUser: msg.role === 'user',
                        // contexts: [] // History might not have contexts saved yet
                    }));
                    setMessages(historyMessages);
                }
            } catch (err) {
                console.error("Failed to load history", err);
            }
        };

        fetchHistory();
    }, [caseData._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            sender: 'You',
            content: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: true
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const responseData = await ragService.chat(caseData._id, newUserMsg.content);

            const botMsg: Message = {
                id: Date.now() + 1,
                sender: 'AI Assistant',
                avatar: 'https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff',
                content: responseData.answer,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: false,
                contexts: responseData.contexts
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                sender: 'System',
                content: "Sorry, I encountered an error processing your request.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: false
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Security Banner */}
            <div className="bg-blue-50 border-b border-blue-100 py-2 flex items-center justify-center gap-2 text-xs font-medium text-blue-700">
                <LockIcon />
                This channel is encrypted and Attorney-Client Privileged.
            </div>

            {/* Split layout */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col border-r border-slate-200">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                        
                        {messages.length === 0 && (
                            <div className="text-center text-slate-500 py-10">Start a conversation with your AI Associate.</div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex gap-4 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                                {!msg.isUser && (
                                    <img src={msg.avatar || "https://ui-avatars.com/api/?name=" + msg.sender} alt={msg.sender} className="w-10 h-10 rounded-full object-cover mt-1" />
                                )}
                                <div className={`max-w-2xl ${msg.isUser ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-sm font-bold text-slate-900">{msg.sender}</span>
                                        <span className="text-xs text-slate-400">{msg.time}</span>
                                    </div>
                                    <div className={`${msg.isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'} p-4 rounded-2xl text-sm leading-relaxed mb-3 shadow-sm`}>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                        
                                        {/* Sources Section */}
                                        {msg.contexts && msg.contexts.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-slate-200/50">
                                                <p className="text-xs font-semibold opacity-70 mb-2 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Sources:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.contexts.map((ctx, idx) => (
                                                        ctx.source ? (
                                                            <a 
                                                                key={idx} 
                                                                href={`http://localhost:8000/files/${ctx.source}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                                                title="View original document"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                {ctx.source}
                                                            </a>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4">
                                <img src="https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff" alt="AI" className="w-10 h-10 rounded-full object-cover mt-1" />
                                <div className="bg-slate-100 text-slate-800 rounded-tl-none p-4 rounded-2xl shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
                            <textarea 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..." 
                                className="flex-1 bg-transparent max-h-32 min-h-[24px] resize-none outline-none text-sm text-slate-700 placeholder-slate-400 py-1"
                                rows={1}
                                style={{ minHeight: '24px' }}
                            ></textarea>
                            <div className="flex items-center gap-2 pb-0.5">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                                    <PaperClipIcon />
                                </button>
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`p-2 rounded-full shadow-sm transition-colors flex items-center justify-center ${
                                        !inputValue.trim() || isLoading 
                                        ? 'bg-slate-300 text-white cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Removed */}
            </div>
        </>
    );
};

export default CaseChat;
