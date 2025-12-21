import React from 'react';
import PortalLayout from '../components/PortalLayout';

// Icons
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const PlusIcon = () => (
     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
const MoreIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
)
const DownloadIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)
const FileIcon = () => (
    <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
)


const PortalMessages: React.FC = () => {
    return (
        <PortalLayout>
            <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Left Sidebar: Conversations */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                                <span className="bg-white/20 p-0.5 rounded"><PlusIcon /></span> New Message
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium">All</button>
                            <button className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-medium transition-colors">Unread</button>
                            <button className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-medium transition-colors">Archived</button>
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-slate-100">
                            
                            {/* Item 1 - Active */}
                            <div className="p-4 cursor-pointer bg-blue-50/50 hover:bg-blue-50 relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="James McGill" className="w-10 h-10 rounded-full object-cover" />
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">James McGill, Esq.</h4>
                                            <p className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide w-fit">Case #402</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600">10:45 AM</span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 pl-12">
                                    Please review the attached settlement agreement draft. Let me know if you have any questions...
                                </p>
                            </div>

                            {/* Item 2 */}
                            <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                         <div className="relative">
                                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Sarah Kim" className="w-10 h-10 rounded-full object-cover" />
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Sarah Kim (Paralegal)</h4>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Estate Planning</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">Yesterday</span>
                                </div>
                                <p className="text-sm text-slate-900 font-medium line-clamp-1 pl-12">
                                    Confirming your appointment for next Tuesday.
                                    <span className="inline-block w-2 H-2 bg-blue-600 rounded-full ml-2"></span>
                                </p>
                            </div>

                            {/* Item 3 */}
                            <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                            FD
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Front Desk</h4>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">General Inquiry</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">Oct 24</span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 pl-12">
                                    Parking validation is available in the lobby.
                                </p>
                            </div>

                             {/* Item 4 */}
                             <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" alt="Robert Davis" className="w-10 h-10 rounded-full object-cover grayscale opacity-70" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 opacity-60">Robert Davis, Esq.</h4>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Case #402</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">Oct 20</span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 pl-12">
                                    The deposition has been rescheduled.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Area: Chat Interface */}
                <div className="flex-1 flex flex-col bg-white">
                    
                    {/* Chat Header */}
                    <div className="h-20 px-6 border-b border-slate-200 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="James McGill" className="w-10 h-10 rounded-full object-cover" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    James McGill, Esq. 
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Active Now • Case #402
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"><SearchIcon /></button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"><MoreIcon /></button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                        
                        {/* Date Divider */}
                         <div className="flex justify-center">
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Yesterday</span>
                        </div>

                         {/* Message: Them */}
                         <div className="flex gap-4 max-w-2xl">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="James McGill" className="w-8 h-8 rounded-full object-cover mt-1" />
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-900">James McGill, Esq.</span>
                                    <span className="text-[10px] text-slate-400">4:30 PM</span>
                                </div>
                                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                                    <p className="mb-2">Hi John, I hope you're doing well.</p>
                                    <p>Just wanted to give you a quick heads up that the opposing counsel has responded to our initial letter. They are open to negotiation.</p>
                                </div>
                            </div>
                        </div>

                        {/* Message: Me */}
                        <div className="flex flex-row-reverse gap-4 max-w-2xl ml-auto">
                            <div className="w-8 h-8 rounded-full bg-amber-200 mt-1 flex-shrink-0"></div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-[10px] text-slate-400">4:45 PM</span>
                                    <span className="text-xs font-bold text-slate-900">You</span>
                                </div>
                                <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-md text-sm text-white leading-relaxed">
                                    <p className="mb-2">That is great news, James! Thank you for the update.</p>
                                    <p>Do we need to schedule a call to discuss the next steps?</p>
                                </div>
                            </div>
                        </div>

                        {/* Date Divider */}
                        <div className="flex justify-center">
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Today</span>
                        </div>

                         {/* Message: Them (with attachment) */}
                         <div className="flex gap-4 max-w-2xl">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="James McGill" className="w-8 h-8 rounded-full object-cover mt-1" />
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-900">James McGill, Esq.</span>
                                    <span className="text-[10px] text-slate-400">10:45 AM</span>
                                </div>
                                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                                    <p className="mb-4">Good morning. Yes, let's aim for a call later this week.</p>
                                    <p className="mb-4">In the meantime, please review the attached draft of the settlement agreement. Let me know if you have any questions about the terms in Section 3.</p>
                                    
                                    {/* Attachment Card */}
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 hover:bg-slate-100 transition-colors cursor-pointer group">
                                        <div className="bg-rose-50 p-2 rounded text-rose-500">
                                            <FileIcon />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">Settlement_Agreement_Draft_v2.pdf</p>
                                            <p className="text-xs text-slate-500">2.4 MB • PDF Document</p>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                            <DownloadIcon />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex justify-center mb-4">
                            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Privileged & Confidential Communication</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <PaperClipIcon />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Type your message here..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors">
                                <SendIcon />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </PortalLayout>
    );
};

export default PortalMessages;
