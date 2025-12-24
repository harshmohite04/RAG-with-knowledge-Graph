import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dummyMessages } from '../data/dummyData';
import PortalLayout from '../components/PortalLayout';

// Interfaces
interface Message {
    _id: string | number;
    content: string;
    senderId: string;
    timestamp: string;
}

interface Conversation {
    contactId: string;
    messages: Message[];
    lastMessage: Message | null;
    name: string;
}


interface PortalUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

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
const UserPlusIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
)

const PortalMessages: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [activeMessages, setActiveMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [userId, setUserId] = useState<string>('');
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<PortalUser | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        const tempConvos: Record<string, Conversation> = {};
        
        // Process dummy messages
        // In a real app, this would be an API call fetching grouped conversations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dummyMessages.forEach((msg: any) => {
            const contactName = msg.sender;
            // If the message is from 'You', we need to find who it was sent to, 
            // but the current dummy structure is simple (just sender/content). 
            // We'll assume for this dummy data fix that 'You' messages belong to the context 
            // of the separate 'contact' flows, but strictly speaking properly grouped data 
            // implies we know the conversation partner ID.
            // For now, we filter out 'You' as initiators of new conversation blocks to avoid self-chats.
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

        // Calculate lastMessage for each
        Object.keys(tempConvos).forEach(key => {
            const convo = tempConvos[key];
            // Sort by time if needed, but dummy data might be mixed. 
            // We'll take the last one in the array as the latest.
            if (convo.messages.length > 0) {
                convo.lastMessage = convo.messages[convo.messages.length - 1];
            }
        });

        setConversations(Object.values(tempConvos));
         
         // Check for contact param
         const contactParam = searchParams.get('contact');
         
         if (contactParam && tempConvos[contactParam]) {
             setSelectedContactId(contactParam);
             setActiveMessages(tempConvos[contactParam].messages);
         } else if (selectedContactId && tempConvos[selectedContactId]) {
             // Keep current selection if valid
             setActiveMessages(tempConvos[selectedContactId].messages);
         } else if (!selectedContactId && Object.keys(tempConvos).length > 0) {
              // Default to first
              const firstId = Object.keys(tempConvos)[0];
              setSelectedContactId(firstId);
              setActiveMessages(tempConvos[firstId].messages);
         }
    };

    useEffect(() => {
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

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);



    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedContactId) return;

        const newMessage: Message = {
            _id: Date.now(),
            content: inputMessage,
            senderId: 'You',
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };

        // Update active messages
        const updatedMessages = [...activeMessages, newMessage];
        setActiveMessages(updatedMessages);
        setInputMessage('');

        // Update conversation list with new last message
        setConversations(prevConvos => 
            prevConvos.map(c => 
                c.contactId === selectedContactId 
                    ? { ...c, messages: updatedMessages, lastMessage: newMessage }
                    : c
            )
        );
    };
    
    // Select contact handler
    const handleSelectContact = (id: string) => {
         setSelectedContactId(id);
         const convo = conversations.find(c => c.contactId === id);
         if (convo) setActiveMessages(convo.messages);
    }

    const [searchError, setSearchError] = useState('');

    const performSearch = useCallback((email: string) => {
        setIsSearching(true);
        setFoundUser(null);
        setSearchError('');

        // Simulate API call with dummy data
        setTimeout(() => {
            const namePart = email.split('@')[0];
            const mockName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            
            // Mock success if email contains 'fail' for testing, otherwise success
            if (email.includes('fail')) {
                 setFoundUser(null);
                 setSearchError('User not found (Simulated)');
            } else {
                 setFoundUser({
                    id: namePart,
                    name: mockName,
                    email: email,
                    avatar: mockName.substring(0, 2).toUpperCase()
                });
            }
            setIsSearching(false);
        }, 500);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchEmail.trim()) {
                performSearch(searchEmail);
            } else {
                setFoundUser(null);
                setSearchError('');
            }
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [searchEmail, performSearch]);



    const handleSearchUser = (e: React.FormEvent) => {
        e.preventDefault();
        // Manual submit can trigger immediate search (if needed, or just let debounce handle it)
        if (searchEmail.trim()) {
            performSearch(searchEmail);
        }
    };

    const handleAddFoundUser = () => {
        if (!foundUser) return;

        const newConvo: Conversation = {
            contactId: foundUser.id,
            messages: [],
            lastMessage: { 
                _id: Date.now(),
                content: 'New conversation started', 
                senderId: 'System',
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            },
            name: foundUser.name
        };
        
        setConversations([newConvo, ...conversations]);
        setSelectedContactId(foundUser.id);
        setActiveMessages([]);
        
        // Reset and close
        setShowAddFriendModal(false);
        setSearchEmail('');
        setFoundUser(null);
    };

    const closeModal = () => {
        setShowAddFriendModal(false);
        setSearchEmail('');
        setFoundUser(null);
        setIsSearching(false);
    }

    const selectedConversation = conversations.find(c => c.contactId === selectedContactId);

    return (
        <PortalLayout>
            <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                
                {/* Left Sidebar: Conversations */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Chat</h2>
                            <button 
                                onClick={() => setShowAddFriendModal(true)}
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors flex items-center gap-2 group"
                                title="Add friend via email"
                            >
                                <span className="text-xs font-bold text-blue-600 hidden group-hover:inline-block">Add Friend</span>
                                <UserPlusIcon />
                            </button>
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

                            {conversations.map((convo) => (
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
                                                    {convo.name.substring(0,2).toUpperCase()}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{convo.name}</h4>
                                                <p className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide w-fit">Active</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600">
                                            {convo.lastMessage ? convo.lastMessage.timestamp : ''}
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
                        {activeMessages.map((msg) => {
                            const isMe = msg.senderId === userId || msg.senderId === 'You';
                            return (
                                <div key={msg._id} className={`flex gap-4 max-w-2xl ${isMe ? 'flex-row-reverse ml-auto' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                                        {isMe ? 'ME' : 'OT'}
                                    </div>
                                    <div className={`${isMe ? 'items-end' : ''} flex flex-col`}>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-900">{isMe ? 'You' : 'Contact'}</span>
                                            <span className="text-[10px] text-slate-400">
                                                {msg.timestamp}
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

                {/* Add Friend Modal Overlay */}
                {showAddFriendModal && (
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Find People</h3>
                            <p className="text-sm text-slate-500 mb-6">Search for users by email to add them to your chat.</p>
                            
                            <form onSubmit={handleSearchUser}>
                                <div className="mb-4 relative">
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="user@example.com"
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isSearching || !searchEmail}
                                        className="absolute right-2 top-0 bottom-0 my-auto h-fit mt-7 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Search"
                                    >
                                       {isSearching ? (
                                           <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                           </svg>
                                       ) : (
                                         <SearchIcon />
                                       )}
                                    </button>
                                </div>
                            </form>
                            
                            {searchError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                                    {searchError}
                                </div>
                            )}

                            {/* User found card */}
                            {foundUser && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between mb-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                                            {foundUser.avatar}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{foundUser.name}</h4>
                                            <p className="text-xs text-slate-500">{foundUser.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleAddFoundUser}
                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                        title="Add Friend"
                                    >
                                        <UserPlusIcon />
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
};

export default PortalMessages;
