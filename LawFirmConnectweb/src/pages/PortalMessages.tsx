import React, { useState, useEffect, useRef, useCallback } from 'react';
import PortalLayout from '../components/PortalLayout';
import { 
    Search as SearchIcon, 
    Send as SendIcon, 
    UserPlus as UserPlusIcon,
    Paperclip as PaperClipIcon
} from 'lucide-react';
import { contactService } from '../services/contactService';
import { messageService } from '../services/messageService';
import { io, Socket } from 'socket.io-client';

interface Message {
    _id: string; 
    content: string;
    sender: string; 
    timestamp: string;
    read?: boolean;
    senderModel?: any; 
}

interface Conversation {
    contactId: string;
    name: string;
    lastMessage: {
        content: string;
        timestamp: string;
        senderId?: string;
    } | null;
    avatar?: string;
    unreadCount?: number;
}

interface PortalUser {
    id: string; 
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

const PortalMessages: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
    const [activeMessages, setActiveMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [userId, setUserId] = useState<string>(''); 
    
    // Search & Add Friend State
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<PortalUser | null>(null);
    const [searchError, setSearchError] = useState('');
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserId(user._id || user.id);
            }
        } catch (e) {
            console.error(e);
        }
        
        const loadData = async () => {
             await fetchMessagesAndContacts();
             await fetchPendingRequests();
        };
        loadData();
    }, []);

    // Socket initialization
    useEffect(() => {
        if (!userId) return;

        socketRef.current = io('https://0c89861a03c4.ngrok-free.app'); // Ensure this matches your backend URL

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
            socketRef.current?.emit('join', userId);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [userId]);

    // Ref to track selected contact for socket callbacks to avoid stale state
    const selectedContactIdRef = useRef<string | null>(null);
    useEffect(() => {
        selectedContactIdRef.current = selectedContactId;
    }, [selectedContactId]);

    // Listen for new messages
    useEffect(() => {
        if (!socketRef.current) return;

        const listener = (message: any) => {
            console.log('socket: newMessage received:', message);
            const currentContactId = selectedContactIdRef.current;
            
            // Normalize IDs to strings
            const msgSender = message.sender?._id || message.sender;
            const msgRecipient = message.recipient?._id || message.recipient;
            
            // If we are the sender, the other party is the recipient
            // If we are the recipient, the other party is the sender
            // But we only care if this message belongs to the current OPEN chat (currentContactId)
            
            const isRelated = (msgSender === currentContactId) || (msgRecipient === currentContactId);

            if (isRelated) {
                if (currentContactId && msgSender === currentContactId) {
                     messageService.markAsRead(currentContactId);
                }
                
                setActiveMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(m => m._id === message._id)) return prev;
                    
                    const formattedMsg: Message = {
                        _id: message._id,
                        content: message.content,
                        sender: typeof msgSender === 'object' ? msgSender.toString() : msgSender, // Ensure string
                        timestamp: new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        read: message.read
                    };
                    return [...prev, formattedMsg];
                });
            }
            
            updateConversationsList(message);
        };

        const readListener = ({ recipientId, contactId }: any) => {
             // contactId is ME (the sender of the original messages)
             // recipientId is the person who read them (the current contact)
             
             if (selectedContactIdRef.current === recipientId) {
                 setActiveMessages(prev => prev.map(msg => 
                     (msg.sender === userId && !msg.read) ? { ...msg, read: true } : msg
                 ));
             }
        };

        socketRef.current.off('newMessage'); 
        socketRef.current.on('newMessage', listener);
        socketRef.current.on('messagesRead', readListener);
        
        return () => {
            socketRef.current?.off('newMessage', listener);
            socketRef.current?.off('messagesRead', readListener);
        };
    }, [userId]);  

    const updateConversationsList = (message: any) => {
        setConversations(prev => {
            const msgSender = message.sender?._id || message.sender;
            const msgRecipient = message.recipient?._id || message.recipient;
            
            // Identify the contact ID for this conversation
            // If I sent it, contact is recipient. If I received it, contact is sender.
            const otherId = msgSender === userId ? msgRecipient : msgSender;

            const existingIndex = prev.findIndex(c => c.contactId === otherId);
            
            const newLastMsg = {
                content: message.content,
                timestamp: new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                senderId: msgSender
            };

            if (existingIndex >= 0) {
                const newConvos = [...prev];
                newConvos[existingIndex] = {
                    ...newConvos[existingIndex],
                    lastMessage: newLastMsg
                };
                // Move to top
                const [moved] = newConvos.splice(existingIndex, 1);
                return [moved, ...newConvos];
            } else {
                fetchMessagesAndContacts(); // Refresh to get new conversation
                return prev; 
            }
        });
    };

    const fetchPendingRequests = async () => {
        try {
            const requests = await contactService.getRequests();
            setPendingRequests(requests);
        } catch (error) {
            console.error("Failed to fetch pending requests", error);
        }
    };

    const fetchMessagesAndContacts = async () => {
        try {
            const contacts = await contactService.getContacts();
            console.log('fetched contacts:', contacts);
            
            const mappedConversations: Conversation[] = contacts.map((contact: any) => ({
                contactId: contact._id,
                name: `${contact.firstName} ${contact.lastName}`,
                avatar: undefined,
                lastMessage: null, 
                unreadCount: 0
            }));

            setConversations(mappedConversations);
        } catch (error) {
            console.error("Failed to fetch contact list", error);
        }
    };

    const handleSelectContact = async (contactId: string) => {
        console.log('selecting contact:', contactId);
        setSelectedContactId(contactId);
        setActiveMessages([]); 
        
        try {
            await messageService.markAsRead(contactId);
            const msgs = await messageService.getMessages(contactId);
            console.log('fetched messages:', msgs);
            const formatted: Message[] = msgs.map((m: any) => ({
                _id: m._id,
                content: m.content,
                sender: m.sender, // Should be string ID from backend
                timestamp: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                read: m.read
            }));
            setActiveMessages(formatted);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedContactId) return;

        try {
            const sentMsg = await messageService.sendMessage(selectedContactId, inputMessage);
            console.log('message sent response:', sentMsg);
            
            // Manually append to UI for immediate feedback
            const formattedMsg: Message = {
                _id: sentMsg._id,
                content: sentMsg.content,
                sender: sentMsg.sender._id || sentMsg.sender || userId,
                timestamp: new Date(sentMsg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                read: sentMsg.read
            };
            
            setActiveMessages(prev => {
                // Dedupe just in case socket arrives instantly
                if (prev.some(m => m._id === sentMsg._id)) return prev;
                return [...prev, formattedMsg];
            });
            
            setInputMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);

    // Search Logic
    const performSearch = useCallback(async (email: string) => {
        setIsSearching(true);
        setFoundUser(null);
        setSearchError('');

        try {
            const users = await contactService.searchUsers(email);
            if (users && users.length > 0) {
                const match = users.find((u: any) => u.email === email) || users[0];
                setFoundUser({
                    id: match._id,
                    name: `${match.firstName} ${match.lastName || ''}`.trim(),
                    email: match.email,
                    avatar: (match.firstName || 'U').substring(0, 2).toUpperCase(),
                    role: match.role
                });
            } else {
                 setFoundUser(null);
                 setSearchError('User not found');
            }
        } catch (err) {
            console.error(err);
            setSearchError('Error searching for user');
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchEmail.trim()) {
                performSearch(searchEmail);
            } else {
                setFoundUser(null);
                setSearchError('');
            }
        }, 800); 

        return () => clearTimeout(timer);
    }, [searchEmail, performSearch]);

    const handleSearchUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchEmail.trim()) {
            performSearch(searchEmail);
        }
    };

    const handleAddFoundUser = async () => {
        if (!foundUser) return;

        try {
            await contactService.sendRequest(foundUser.id);
            setSearchError('Friend request sent!');
            setTimeout(() => {
                setShowAddFriendModal(false);
                setSearchEmail('');
                setFoundUser(null);
                setSearchError('');
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setSearchError(err.response?.data?.message || 'Failed to send request');
        }
    };

    const handleRespondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
        try {
            await contactService.respondToRequest(requestId, action);
            if (action === 'accept') {
                await fetchMessagesAndContacts();
                setActiveTab('chats');
            }
            await fetchPendingRequests();
        } catch (error) {
            console.error("Failed to respond to request", error);
        }
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
                
                {/* Left Sidebar */}
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
                                <UserPlusIcon className="w-5 h-5 text-blue-600" />
                            </button>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex gap-2 mb-3">
                            <button 
                                onClick={() => setActiveTab('chats')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'chats' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                Chats
                            </button>
                            <button 
                                onClick={() => setActiveTab('requests')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors relative ${activeTab === 'requests' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                Requests
                                {pendingRequests.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white ring-2 ring-white">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {activeTab === 'chats' && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search chats..." 
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content List */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'chats' ? (
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
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {pendingRequests.length === 0 && (
                                    <div className="p-8 text-center flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                            <UserPlusIcon className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">No pending requests</p>
                                        <button 
                                            onClick={() => setShowAddFriendModal(true)}
                                            className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                                        >
                                            Find people
                                        </button>
                                    </div>
                                )}

                                {pendingRequests.map(req => (
                                    <div key={req._id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                {(req.sender.firstName || 'U').substring(0,2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{req.sender.firstName} {req.sender.lastName}</h4>
                                                <p className="text-xs text-slate-500">{req.sender.email}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Sent a friend request</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pl-13">
                                            <button 
                                                onClick={() => handleRespondToRequest(req._id, 'accept')}
                                                className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleRespondToRequest(req._id, 'reject')}
                                                className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            // Handle both populated object and string ID for sender
                            const senderId = typeof msg.sender === 'object' && msg.sender !== null 
                                ? (msg.sender as any)._id 
                                : msg.sender;
                            
                            const isMe = senderId === userId;

                            // Helper for initials
                            const getInitials = (name: string) => {
                                if (!name) return '??';
                                const parts = name.split(' ');
                                if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                                return name.substring(0, 2).toUpperCase();
                            };
                            
                            // Determine avatar text
                            let avatarText = '??';
                            if (isMe) {
                                try {
                                    const userStr = localStorage.getItem('user');
                                    if (userStr) {
                                        const user = JSON.parse(userStr);
                                        const fname = user.firstName || '';
                                        const lname = user.lastName || '';
                                        avatarText = (fname[0] || '') + (lname[0] || '');
                                        if (!avatarText) avatarText = 'ME';
                                    } else {
                                        avatarText = 'ME';
                                    }
                                } catch (e) {
                                    avatarText = 'ME'; 
                                }
                            } else {
                                const convo = conversations.find(c => c.contactId === senderId);
                                avatarText = convo ? getInitials(convo.name) : 'OT';
                            }
                            
                            return (
                                <div key={msg._id} className={`flex gap-4 max-w-2xl ${isMe ? 'flex-row-reverse ml-auto' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                                        {avatarText.toUpperCase()}
                                    </div>
                                    <div className={`${isMe ? 'items-end' : ''} flex flex-col`}>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-[10px] text-slate-400">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        <div className={`${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'} p-4 rounded-2xl shadow-sm text-sm leading-relaxed`}>
                                            <p>{msg.content}</p>
                                        </div>
                                         <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''} px-1`}>
                                            {isMe && (
                                                <span className={`text-[10px] ${msg.read ? 'text-blue-500' : 'text-slate-300'}`}>
                                                    {msg.read ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <PaperClipIcon className="w-5 h-5" />
                            </button>
                            <input 
                                type="text" 
                                value={inputMessage}
                                onChange={e => setInputMessage(e.target.value)}
                                placeholder="Type your message here..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Add Friend Modal */}
                {showAddFriendModal && (
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Find People</h3>
                            <p className="text-sm text-slate-500 mb-6">Search for users by email to send a request.</p>
                            
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
                                         <SearchIcon className="w-5 h-5" />
                                       )}
                                    </button>
                                </div>
                            </form>
                            
                            {searchError && (
                                <div className={`mb-4 p-3 text-sm rounded-lg border animate-in fade-in slide-in-from-top-1 ${searchError.includes('sent') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {searchError}
                                </div>
                            )}

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
                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-xs font-bold px-3"
                                        title="Send Request"
                                    >
                                        Send Request
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
