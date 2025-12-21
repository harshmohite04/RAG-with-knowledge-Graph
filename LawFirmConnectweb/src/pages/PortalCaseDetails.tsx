import React, { useState } from 'react';
import PortalLayout from '../components/PortalLayout';

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
const SendIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
const FileIconBlue = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 text-blue-500 ${className || ''}`} fill="currentColor" viewBox="0 0 24 24">
         <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
)
const CheckCircleIcon = () => (
    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
)
const BoldIcon = () => <span className="font-serif font-bold text-slate-500 text-lg">B</span>
const ItalicIcon = () => <span className="font-serif italic text-slate-500 text-lg">I</span>
const ListIcon = () => (
     <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
)

// Document View Icons
const CloudUploadIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
)
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const FilterIcon = () => (
    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
         <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
)
const SortIcon = () => (
    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
)
const ViewGridIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
         <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
)
const ViewListIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
)
const PDFIcon = () => (
     <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        <text x="7" y="17" fontSize="6" fontWeight="bold" fill="currentColor">PDF</text>
    </svg>
)
const ImageIcon = () => (
    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" opacity="0.1" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)
const DocIcon = () => (
     <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
         <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8m-8 4h5"/>
    </svg>
)

const PortalCaseDetails: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'chat' | 'billing'>('documents');

    return (
        <PortalLayout>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[calc(100vh-140px)] flex flex-col">
                
                {/* Custom Page Header */}
                <div className="border-b border-slate-200 px-6 pt-6 pb-0 bg-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <div className="flex items-center gap-2 mb-1 text-sm text-slate-500">
                                <span>Cases</span>
                                <span>/</span>
                                <span>Smith v. Jones</span>
                                <span>/</span>
                                <span className="font-bold text-slate-900 capitalize">{activeTab}</span>
                             </div>
                             <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                 {activeTab === 'documents' ? 'Case Documents' : 'Case #2023-994'}
                             </h1>
                             
                             {activeTab === 'documents' && (
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                                    Case #2023-004: Estate of J. Doe
                                </div>
                             )}
                             {activeTab !== 'documents' && <p className="text-slate-500">Smith Estate Planning</p>}

                        </div>
                        
                        {/* Header Actions */}
                        <div className="flex items-center gap-3">
                             {activeTab === 'documents' ? (
                                <>
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100">
                                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        Encrypted & Secure
                                    </div>
                                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                        <CloudUploadIcon /> Upload Document
                                    </button>
                                </>
                             ) : (
                                <div className="flex gap-2">
                                     <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                     </button>
                                     <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                     </button>
                                     <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-9 h-9 rounded-full object-cover ml-2" />
                                </div>
                             )}
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <button onClick={() => setActiveTab('overview')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Overview</button>
                        <button onClick={() => setActiveTab('documents')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Documents</button>
                        <button onClick={() => setActiveTab('chat')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Chat</button>
                        <button onClick={() => setActiveTab('billing')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'billing' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Billing</button>
                    </div>
                </div>


                {/* CONTENT AREA */}
                
                {/* 1. CHAT TAB CONTENT */}
                {activeTab === 'chat' && (
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
                                    
                                    <div className="flex justify-center">
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Today, Oct 24</span>
                                    </div>

                                    {/* Message 1 */}
                                    <div className="flex gap-4">
                                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Jane Doe" className="w-10 h-10 rounded-full object-cover mt-1" />
                                        <div className="max-w-2xl">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-900">Jane Doe</span>
                                                <span className="text-xs text-slate-400">10:42 AM</span>
                                            </div>
                                            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-800 text-sm leading-relaxed mb-3">
                                                Good morning. I've uploaded the initial estate draft for your review. Please look it over when you have a moment, particularly section 4 regarding the trust allocation.
                                            </div>
                                            
                                            {/* Attachment Card */}
                                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 w-fit hover:bg-slate-100 transition-colors cursor-pointer group">
                                                <div className="bg-rose-50 p-2 rounded text-rose-500">
                                                    <FileIcon />
                                                </div>
                                                <div className="min-w-0 pr-4">
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Smith_Estate_Draft_v1.pdf</p>
                                                    <p className="text-xs text-slate-500">2.4 MB • PDF Document</p>
                                                </div>
                                                <button className="text-slate-400 hover:text-blue-600">
                                                    <DownloadIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message 2 (You) */}
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs text-slate-400">10:55 AM</span>
                                            <span className="text-sm font-bold text-slate-900">You</span>
                                        </div>
                                        <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed max-w-2xl shadow-sm">
                                            Thanks Jane. I see the file. I'll review it tonight. Does section 4 cover the charitable donations we discussed?
                                        </div>
                                    </div>

                                    {/* Message 3 */}
                                    <div className="flex gap-4">
                                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Jane Doe" className="w-10 h-10 rounded-full object-cover mt-1" />
                                        <div className="max-w-2xl">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-900">Jane Doe</span>
                                                <span className="text-xs text-slate-400">11:02 AM</span>
                                            </div>
                                            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-800 text-sm leading-relaxed">
                                                Yes, exactly. It's drafted to allow for a flexible percentage as you requested. Let me know if the wording feels right.
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Chat Input */}
                                <div className="p-6 bg-white border-t border-slate-200">
                                    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
                                        <div className="flex items-center gap-4 p-2 border-b border-slate-100 bg-slate-50">
                                            <button className="p-1 hover:bg-slate-200 rounded transition-colors"><BoldIcon /></button>
                                            <button className="p-1 hover:bg-slate-200 rounded transition-colors"><ItalicIcon /></button>
                                            <button className="p-1 hover:bg-slate-200 rounded transition-colors"><ListIcon /></button>
                                            <div className="w-px h-5 bg-slate-300 mx-1"></div>
                                            <button className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900">
                                                <PaperClipIcon /> Attach File
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <textarea 
                                                placeholder="Type a secure message to your legal team..." 
                                                className="w-full h-20 resize-none outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-between items-center p-3 pt-0">
                                            <span className="text-[10px] text-slate-400">Press Enter to send</span>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                                                Send Securely <SendIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="w-full lg:w-80 bg-white p-6 space-y-8 overflow-y-auto border-l border-slate-200">
                                
                                {/* Case Details */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-4">Case Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</span>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filed Date</span>
                                            <span className="text-sm font-medium text-slate-900">Oct 12, 2023</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Privilege Level</span>
                                            <div className="flex items-center gap-1.5 text-blue-600 text-sm font-bold">
                                                <CheckCircleIcon /> Attorney-Client
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Legal Team */}
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 className="text-sm font-bold text-slate-900">Legal Team</h3>
                                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-1.5 py-0.5 rounded-md">3</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Jane Doe" className="w-9 h-9 rounded-full object-cover" />
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Jane Doe</p>
                                                <p className="text-xs text-blue-600">Lead Attorney</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" alt="John Smith" className="w-9 h-9 rounded-full object-cover" />
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-300 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">John Smith</p>
                                                <p className="text-xs text-blue-600">Paralegal</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100" alt="Sarah Connor" className="w-9 h-9 rounded-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Sarah Connor</p>
                                                <p className="text-xs text-blue-600">Junior Associate</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shared Files */}
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 className="text-sm font-bold text-slate-900">Shared Files</h3>
                                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="bg-rose-50 p-1.5 rounded text-rose-500 group-hover:scale-110 transition-transform">
                                                    <FileIconBlue className="text-rose-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">Smith_Estate_Draft...</p>
                                                <p className="text-[10px] text-slate-500">Oct 24 • 2.4MB</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="bg-blue-50 p-1.5 rounded text-blue-500 group-hover:scale-110 transition-transform">
                                                    <FileIconBlue />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">Initial_Consult_Not...</p>
                                                <p className="text-[10px] text-slate-500">Oct 12 • 156KB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
                )}

                {/* 2. DOCUMENTS TAB CONTENT */}
                {activeTab === 'documents' && (
                    <div className="flex-1 bg-slate-50 p-6 flex flex-col gap-6 overflow-hidden">
                        
                        {/* Action Bar */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                            <div className="relative flex-1 max-w-lg">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search by file name..." 
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                    <FilterIcon /> Filter
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                    <SortIcon /> Sort by: Date
                                </button>
                                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                <div className="flex bg-slate-100 rounded-lg p-0.5">
                                    <button className="p-1.5 rounded text-slate-500 hover:text-slate-700 hover:bg-white shadow-sm transition-all"><ViewGridIcon /></button>
                                    <button className="p-1.5 rounded bg-white text-blue-600 shadow transition-all"><ViewListIcon /></button>
                                </div>
                            </div>
                        </div>

                        {/* Filter Categories */}
                        <div className="flex gap-2">
                             <button className="bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">All Files <span className="bg-white text-slate-900 text-[10px] px-1.5 py-0.5 rounded ml-1">24</span></button>
                             <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Court Filings</button>
                             <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Evidence</button>
                             <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Correspondence</button>
                        </div>

                        {/* Documents List */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded By</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date Added</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        
                                        {/* Row 1 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-rose-50 p-2 rounded-lg">
                                                        <PDFIcon />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Motion to Dismiss.pdf</p>
                                                        <span className="inline-block bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1">New</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">Court Filing</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">AS</span>
                                                    <span className="text-sm font-bold text-slate-900">Attorney Smith</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">Oct 24, 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">2.4 MB</td>
                                        </tr>

                                        {/* Row 2 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50 p-2 rounded-lg">
                                                        <ImageIcon />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Accident_Photo_01.jpg</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">Evidence</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">CU</span>
                                                    <span className="text-sm font-bold text-slate-900">Client User</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">Oct 20, 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">4.1 MB</td>
                                        </tr>

                                        {/* Row 3 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50 p-2 rounded-lg">
                                                        <DocIcon />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Settlement Draft v2.docx</p>
                                                        <span className="inline-block bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1">Draft</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">Correspondence</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">PJ</span>
                                                    <span className="text-sm font-bold text-slate-900">Paralegal Jones</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">Oct 15, 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">120 KB</td>
                                        </tr>

                                        {/* Row 4 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-rose-50 p-2 rounded-lg">
                                                        <PDFIcon />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Police_Report_Final.pdf</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">Evidence</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">AS</span>
                                                    <span className="text-sm font-bold text-slate-900">Attorney Smith</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">Oct 12, 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">1.8 MB</td>
                                        </tr>

                                         {/* Row 5 */}
                                         <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50 p-2 rounded-lg">
                                                        <DocIcon />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Engagement_Letter_Signed.docx</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">Administrative</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">PJ</span>
                                                    <span className="text-sm font-bold text-slate-900">Paralegal Jones</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">Sep 05, 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">45 KB</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600">
                                Showing <span className="font-bold">1</span> to <span className="font-bold">5</span> of <span className="font-bold">24</span> results
                            </p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                    ← Previous
                                </button>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
};

export default PortalCaseDetails;
