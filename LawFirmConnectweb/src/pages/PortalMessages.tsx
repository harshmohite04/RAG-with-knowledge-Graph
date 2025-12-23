import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dummyMessages } from '../data/dummyData';
import PortalLayout from '../components/PortalLayout';

// Icons
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const PaperClipIcon = () => (
    <svg className="w-5 h-5 text-slate-400 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
)
const SendIcon = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
)

const PortalMessages: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [activeMessages, setActiveMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [userId, setUserId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ... (user info logic same)
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserId(user.id);
            }
        } catch (e) {
            console.error(e);
        }
        
        fetchMessages();
    }, []);

    // ...

    const fetchMessages = async () => {
        const tempConvos: any = {};
        
        dummyMessages.forEach((msg: any) => {
            let contactName = msg.sender;
            if (contactName === 'You') return; 
            
             if (!tempConvos[contactName]) {
                 tempConvos[contactName] = {
                     contactId: contactName, 
                     messages: [],
                     lastMessage: null,
                     name: contactName
                 };
             }
             tempConvos[contactName].messages.push({
                 _id: msg.id,
                 content: msg.content,
                 senderId: msg.sender, 
                 timestamp: msg.time, 
             });
        });

         setConversations(Object.values(tempConvos));
         
         // Check for contact param
         const contactParam = searchParams.get('contact');
         
         if (contactParam && tempConvos[contactParam]) {
             setSelectedContactId(contactParam);
             setActiveMessages(tempConvos[contactParam].messages);
         } else if (selectedContactId && tempConvos[selectedContactId]) {
             setActiveMessages(tempConvos[selectedContactId].messages);
         } else if (!selectedContactId && Object.keys(tempConvos).length > 0) {
              const firstId = Object.keys(tempConvos)[0];
              setSelectedContactId(firstId);
              setActiveMessages(tempConvos[firstId].messages);
         }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedContactId) return;

        const newMessage = {
            _id: Date.now(),
            content: inputMessage,
            senderId: 'You',
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };

        setActiveMessages([...activeMessages, newMessage]);
        setInputMessage('');
    };
    
    // Select contact handler
    const handleSelectContact = (id: string) => {
         setSelectedContactId(id);
         const convo = conversations.find(c => c.contactId === id);
         if (convo) setActiveMessages(convo.messages);
    }

    const selectedConversation = conversations.find(c => c.contactId === selectedContactId);

    return (
        <PortalLayout>
            <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Left Sidebar: Conversations */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Chat</h2>
                            {/* New Message button currently just a placeholder as we don't have a 'user directory' to pick from yet */}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search chats..." 
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-slate-100">
                            
                            {conversations.length === 0 && (
                                <div className="p-4 text-center text-slate-500 text-sm">No chats yet.</div>
                            )}

                            {conversations.map((convo: any) => (
                                <div 
                                    key={convo.contactId}
                                    onClick={() => handleSelectContact(convo.contactId)}
                                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedContactId === convo.contactId ? 'bg-blue-50/50 relative' : ''}`}
                                >
                                    {selectedContactId === convo.contactId && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                                    
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                                    {/* Initials placeholder since we don't have name populated yet */}
                                                    LC
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{convo.name}</h4>
                                                <p className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide w-fit">Active</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600">
                                            {convo.lastMessage ? new Date(convo.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 pl-12">
                                        {convo.lastMessage ? convo.lastMessage.content : 'No messages'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Area: Chat Interface */}
                <div className="flex-1 flex flex-col bg-white">
                    
                    {/* Chat Header */}
                    <div className="h-20 px-6 border-b border-slate-200 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            {selectedConversation ? (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-slate-900 text-lg">{selectedConversation.name}</h3>
                                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Available
                                        </span>
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                        <button className="font-bold text-slate-900 border-b-2 border-blue-600 pb-2 px-1">Chat</button>
                                        <button className="font-medium text-slate-500 hover:text-slate-700 pb-2 px-1 transition-colors">Shared</button>
                                        <button className="font-medium text-slate-500 hover:text-slate-700 pb-2 px-1 transition-colors">Storyline</button>
                                    </div>
                                </div>
                            ) : (
                                <h3 className="font-bold text-slate-900">Select a chat</h3>
                            )}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                        {activeMessages.map((msg: any) => {
                            const isMe = msg.senderId === userId;
                            return (
                                <div key={msg._id} className={`flex gap-4 max-w-2xl ${isMe ? 'flex-row-reverse ml-auto' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                                        {isMe ? 'ME' : 'OT'}
                                    </div>
                                    <div className={`${isMe ? 'items-end' : ''} flex flex-col`}>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-900">{isMe ? 'You' : 'Contact'}</span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className={`${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'} p-4 rounded-2xl shadow-sm text-sm leading-relaxed`}>
                                            <p>{msg.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex justify-center mb-4">
                            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Privileged & Confidential Communication</span>
                        </div>
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                             <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <PaperClipIcon />
                            </button>
                            <input 
                                type="text" 
                                value={inputMessage}
                                onChange={e => setInputMessage(e.target.value)}
                                placeholder="Type your message here..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors">
                                <SendIcon />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </PortalLayout>
    );
};

export default PortalMessages;
