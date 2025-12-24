import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { dummyMessages } from '../../data/dummyData';
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

const CaseChat: React.FC = () => {
    // @ts-ignore
    const { caseData } = useOutletContext<{ caseData: CaseData }>();

    const handleChatAttachment = () => {
        const fileNames = ['Evidence_Photo.jpg', 'Contract_Draft_v2.pdf', 'Meeting_Notes.docx'];
        const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
        alert(`Request to attach "${randomFile}" received! In a real app, this would open the file picker.`);
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
                        
                        <div className="flex justify-center">
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Recent</span>
                        </div>

                        {dummyMessages.filter(m => m.caseId === caseData?._id).map(msg => (
                            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                                {msg.sender !== 'You' && (
                                    <img src={msg.avatar || "https://ui-avatars.com/api/?name=" + msg.sender} alt={msg.sender} className="w-10 h-10 rounded-full object-cover mt-1" />
                                )}
                                <div className={`max-w-2xl ${msg.sender === 'You' ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-sm font-bold text-slate-900">{msg.sender}</span>
                                        <span className="text-xs text-slate-400">{msg.time}</span>
                                    </div>
                                    <div className={`${msg.sender === 'You' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'} p-4 rounded-2xl text-sm leading-relaxed mb-3 shadow-sm`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {dummyMessages.filter(m => m.caseId === caseData?._id).length === 0 && (
                                <div className="text-center text-slate-500 py-10">No messages yet.</div>
                        )}

                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
                            <textarea 
                                placeholder="Type a message..." 
                                className="flex-1 bg-transparent max-h-32 min-h-[24px] resize-none outline-none text-sm text-slate-700 placeholder-slate-400 py-1"
                                rows={1}
                                style={{ minHeight: '24px' }}
                            ></textarea>
                            <div className="flex items-center gap-2 pb-0.5">
                                <button 
                                    onClick={handleChatAttachment}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors" 
                                    title="Attach File"
                                >
                                    <PaperClipIcon />
                                </button>
                                <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-colors flex items-center justify-center">
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
