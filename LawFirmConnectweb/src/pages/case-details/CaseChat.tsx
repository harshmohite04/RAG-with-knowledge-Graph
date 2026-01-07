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
    
    // Selection & Sources State
    const [selectionCoords, setSelectionCoords] = useState<{x: number, y: number} | null>(null);
    const [selectedContexts, setSelectedContexts] = useState<ContextItem[] | null>(null);
    const [showSourcesModal, setShowSourcesModal] = useState(false);

    const handleMouseUp = (msgContexts?: ContextItem[]) => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !msgContexts || msgContexts.length === 0) {
            setSelectionCoords(null);
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Calculate relative position or absolute
        setSelectionCoords({
            x: rect.left + (rect.width / 2),
            y: rect.top - 10 // slightly above
        });
        setSelectedContexts(msgContexts);
    };

    // Close tooltip if clicking elsewhere
    useEffect(() => {
        const handleClick = () => {
             const selection = window.getSelection();
             if (!selection || selection.isCollapsed) {
                 setSelectionCoords(null);
             }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

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
                        // @ts-ignore
                        contexts: msg.contexts || [] 
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
                <div className="flex-1 flex flex-col relative bg-slate-50/50">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                        
                        {messages.length === 0 && (
                            <div className="text-center text-slate-500 py-20 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                                <h3 className="text-slate-900 font-bold text-lg mb-1">AI Legal Assistant</h3>
                                <p className="text-slate-400 text-sm max-w-xs">Ask questions about the case, retrieve documents, or summarize facts.</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex gap-4 ${msg.isUser ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-backwards`}
                            >
                                {!msg.isUser && (
                                    <div className="flex-shrink-0">
                                        <img src={msg.avatar || "https://ui-avatars.com/api/?name=" + msg.sender} alt={msg.sender} className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-white" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] lg:max-w-2xl ${msg.isUser ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 px-1 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                                    </div>
                                    <div 
                                        onMouseUp={() => handleMouseUp(msg.contexts)}
                                        className={`
                                            p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group transition-all duration-200
                                            ${msg.isUser 
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-200' 
                                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-slate-100 hover:shadow-md'
                                            }
                                            selection:bg-blue-200 selection:text-blue-900
                                        `}
                                    >
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                        
                                        {/* Sources Section */}
                                        {msg.contexts && msg.contexts.length > 0 && (
                                            <div className={`mt-3 pt-3 border-t ${msg.isUser ? 'border-white/20' : 'border-slate-100'}`}>
                                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${msg.isUser ? 'opacity-80' : 'text-slate-400'}`}>
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    References
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.contexts.map((ctx, idx) => (
                                                        ctx.source ? (
                                                            <a 
                                                                key={idx} 
                                                                href={`http://localhost:8000/files/${ctx.source}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className={`
                                                                    inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors border
                                                                    ${msg.isUser 
                                                                        ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' 
                                                                        : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600'
                                                                    }
                                                                `}
                                                                title="View original document"
                                                            >
                                                                <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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
                            <div className="flex gap-4 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                                <div className="bg-white border border-slate-100 text-slate-800 rounded-tl-sm p-4 rounded-2xl shadow-sm">
                                    <div className="flex space-x-1.5">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Floating Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
                        <div className="pointer-events-auto max-w-4xl mx-auto">
                            <div className="flex items-end gap-2 bg-white/80 backdrop-blur-md p-2 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/40 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
                                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors self-center">
                                    <PaperClipIcon />
                                </button>
                                <textarea 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..." 
                                    className="flex-1 bg-transparent max-h-32 min-h-[44px] py-3 resize-none outline-none text-sm text-slate-700 placeholder-slate-400 leading-relaxed"
                                    rows={1}
                                ></textarea>
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`p-3 rounded-full shadow-sm transition-all flex items-center justify-center self-center mb-0.5 ${
                                        !inputValue.trim() || isLoading 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-200 hover:shadow-blue-300 transform hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Removed */}
            </div>

            {/* Check Sources Tooltip */}
            {selectionCoords && selectedContexts && (
                <div 
                    className="fixed z-50 transform -translate-x-1/2 -translate-y-[120%] bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-xl shadow-2xl cursor-pointer hover:bg-slate-800 transition-all animate-in fade-in zoom-in-95 duration-200 border border-white/10 ring-1 ring-black/20"
                    style={{ top: selectionCoords.y, left: selectionCoords.x }}
                    onMouseDown={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        setShowSourcesModal(true);
                        setSelectionCoords(null);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Check Sources <span className="opacity-60 font-normal">({selectedContexts.length})</span>
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/90 backdrop-blur-md rotate-45 border-r border-b border-white/10"></div>
                </div>
            )}

            {/* Sources Modal */}
            {showSourcesModal && selectedContexts && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSourcesModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 ring-1 ring-black/5" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                Cited Sources
                            </h3>
                            <button onClick={() => setShowSourcesModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-slate-50/50">
                            {selectedContexts.map((ctx, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">{idx + 1}</span>
                                            {ctx.source && <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{ctx.source}</span>}
                                        </div>
                                        {ctx.score && (
                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${ctx.score > 0.7 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                Match: {Math.round(ctx.score * 100)}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium pl-7 border-l-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                                        "{ctx.content}"
                                    </p>
                                    {ctx.source && (
                                        <div className="mt-3 pl-7">
                                            <a 
                                                href={`http://localhost:8000/files/${ctx.source}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                Open Document
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CaseChat;
