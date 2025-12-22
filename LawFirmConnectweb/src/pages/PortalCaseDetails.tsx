import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import PortalLayout from '../components/PortalLayout';

interface Document {
    _id: string;
    fileName: string;
    filePath: string;
    category: 'Court Filings' | 'Evidence' | 'Correspondence' | 'General';
    uploadedBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    uploadedAt: string;
    fileSize: number;
}

interface ActivityLogItem {
    _id: string;
    type: string;
    description: string;
    performedBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    metadata?: any;
    createdAt: string;
}

interface CaseData {
    _id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    documents: Document[];
    activityLog: ActivityLogItem[];
    leadAttorneyId?: any;
    teamMembers: any[];
    createdAt: string;
}

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
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
)
const FileIconBlue = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 text-blue-500 ${className || ''}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
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
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
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
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8m-8 4h5" />
    </svg>
)

const PortalCaseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'activity' | 'documents' | 'chat' | 'billing'>('activity');
    const [caseData, setCaseData] = useState<CaseData | null>(null);
    const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchCurrentUser();
    }, []);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [uploadCategory, setUploadCategory] = useState<'Court Filings' | 'Evidence' | 'Correspondence' | 'General'>('General');
    const [uploading, setUploading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('All Files');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
    const [showDeleteDocModal, setShowDeleteDocModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<any>(null);
    const [deletingDoc, setDeletingDoc] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    React.useEffect(() => {
        const fetchCase = async () => {
            try {
                const { data } = await api.get(`/cases/${id}`);
                setCaseData(data);
            } catch (error) {
                console.error("Failed to fetch case", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            // For now, if the API endpoint /cases/:id doesn't exist, this will fail.
            // I recall seeing getCases returning ALL cases.
            // I'll try to fetch all and find for now to avoid blocking if I can't edit backend immediately, but I CAN edit backend.
            // I'll stick to the plan: fetch standard ID.
            // But wait, I see I missed adding GET /:id in my plan.
            // I'll try to use the list endpoint and filter if that complicates things less purely for this step, 
            // but correct way is GET /:id.
            // Let's implement generic fetch first.
            fetchCase();
        }
    }, [id]);

    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            uploadFiles.forEach(file => {
                formData.append('files', file);
            });
            formData.append('category', uploadCategory);

            const response = await api.post(`/cases/${id}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload response:', response.data);

            // Refresh case data
            const { data } = await api.get(`/cases/${id}`);
            setCaseData(data);

            // Reset upload state
            setUploadFiles([]);
            setUploadCategory('General');
            setShowUploadModal(false);
        } catch (error: any) {
            console.error('Failed to upload document', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to upload document. Please try again.';
            alert(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!documentToDelete) return;

        setDeletingDoc(true);
        try {
            await api.delete(`/cases/${id}/documents/${documentToDelete._id}`);

            // Refresh case data
            const { data } = await api.get(`/cases/${id}`);
            setCaseData(data);

            setShowDeleteDocModal(false);
            setDocumentToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete document', error);
            alert(error.response?.data?.message || 'Failed to delete document. Please try again.');
        } finally {
            setDeletingDoc(false);
        }
    };

    // Filter, search, and sort documents
    let filteredDocuments = categoryFilter === 'All Files'
        ? caseData?.documents || []
        : caseData?.documents.filter(doc => doc.category === categoryFilter) || [];

    // Apply search filter
    if (searchQuery) {
        filteredDocuments = filteredDocuments.filter(doc =>
            doc.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Apply sorting
    filteredDocuments = [...filteredDocuments].sort((a, b) => {
        if (sortBy === 'name') {
            return a.fileName.localeCompare(b.fileName);
        } else if (sortBy === 'size') {
            return (b.fileSize || 0) - (a.fileSize || 0);
        } else { // date
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        }
    });

    if (loading) return <PortalLayout><div>Loading...</div></PortalLayout>;
    if (!caseData) return <PortalLayout><div>Case not found</div></PortalLayout>;

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
                                <span>{caseData.title}</span>
                                <span>/</span>
                                <span className="font-bold text-slate-900 capitalize">{activeTab}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                {activeTab === 'documents' ? 'Case Documents' : `Case #${caseData._id.substring(0, 8)}`}
                            </h1>

                            {activeTab === 'documents' && (
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                                    Case #{caseData._id.substring(0, 8)}: {caseData.title}
                                </div>
                            )}
                            {activeTab !== 'documents' && <p className="text-slate-500">{caseData.title}</p>}

                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-3">
                            {activeTab === 'documents' ? (
                                <>
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        Encrypted & Secure
                                    </div>
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                                    >
                                        <CloudUploadIcon /> Upload Document
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2 text-slate-600">
                                    <button className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors relative">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {activeTab !== 'activity' && caseData?.activityLog?.length > 0 && (
                                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>

                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm ml-2 border border-slate-200">
                                        {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : '...'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <button onClick={() => setActiveTab('activity')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Activity</button>
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
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{caseData.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filed Date</span>
                                            <span className="text-sm font-medium text-slate-900">{new Date(caseData.createdAt).toLocaleDateString()}</span>
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
                )

                }

                {/* ACTIVITY TAB CONTENT */}
                {activeTab === 'activity' && (
                    <div className="flex-1 bg-slate-50 p-6 overflow-auto">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Case Activity Timeline</h3>

                                {caseData.activityLog && caseData.activityLog.length > 0 ? (
                                    <div className="space-y-4">
                                        {caseData.activityLog
                                            .slice()
                                            .reverse()
                                            .map((activity) => {
                                                const getActivityIcon = (type: string) => {
                                                    switch (type) {
                                                        case 'case_created':
                                                            return (
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            );
                                                        case 'document_uploaded':
                                                            return (
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                            );
                                                        case 'document_deleted':
                                                            return (
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            );
                                                        default:
                                                            return (
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            );
                                                    }
                                                };

                                                const getActivityColor = (type: string) => {
                                                    switch (type) {
                                                        case 'case_created':
                                                            return 'bg-green-100 text-green-600';
                                                        case 'document_uploaded':
                                                            return 'bg-blue-100 text-blue-600';
                                                        case 'document_deleted':
                                                            return 'bg-red-100 text-red-600';
                                                        default:
                                                            return 'bg-slate-100 text-slate-600';
                                                    }
                                                };

                                                return (
                                                    <div key={activity._id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                                            {getActivityIcon(activity.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                                <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                                                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                                                    {new Date(activity.createdAt).toLocaleString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                                    {activity.performedBy.firstName[0]}{activity.performedBy.lastName[0]}
                                                                </div>
                                                                <span className="text-xs text-slate-600 font-medium">
                                                                    {activity.performedBy.firstName} {activity.performedBy.lastName}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <p>No activity yet for this case.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                        <SortIcon /> Sort by: {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Size'}
                                    </button>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    >
                                        <option value="date">Date</option>
                                        <option value="name">Name</option>
                                        <option value="size">Size</option>
                                    </select>
                                </div>
                                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                <div className="flex bg-slate-100 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700 hover:bg-white shadow-sm'}`}
                                    >
                                        <ViewGridIcon />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700 hover:bg-white shadow-sm'}`}
                                    >
                                        <ViewListIcon />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter Categories */}
                        <div className="flex gap-2">
                            {['All Files', 'Court Filings', 'Evidence', 'Correspondence', 'General'].map(cat => {
                                const count = cat === 'All Files' ? caseData.documents.length : caseData.documents.filter(d => d.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-${categoryFilter === cat ? 'bold' : 'medium'} shadow-sm transition-colors ${categoryFilter === cat
                                            ? 'bg-slate-200 text-slate-900'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {cat} {categoryFilter === cat && <span className="bg-white text-slate-900 text-[10px] px-1.5 py-0.5 rounded ml-1">{count}</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Documents Display - Grid or List */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
                            {viewMode === 'list' ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded By</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date Added</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200">
                                            {filteredDocuments.map((doc) => {
                                                const isPdf = doc.fileName.toLowerCase().endsWith('.pdf');
                                                const isImage = doc.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
                                                const fileSize = doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : '-';

                                                return (
                                                    <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <a
                                                                href={doc.filePath}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download={doc.fileName}
                                                                className="flex items-center gap-3 group cursor-pointer"
                                                            >
                                                                <div className={`p-2 rounded-lg ${isPdf ? 'bg-rose-50' : 'bg-blue-50'} group-hover:scale-110 transition-transform`}>
                                                                    {isPdf ? <PDFIcon /> : isImage ? <ImageIcon /> : <DocIcon />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.fileName}</p>
                                                                    <span className="inline-block bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1">Uploaded</span>
                                                                </div>
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{doc.category}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                                    {doc.uploadedBy.firstName[0]}{doc.uploadedBy.lastName[0]}
                                                                </span>
                                                                <span className="text-sm font-bold text-slate-900">{doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{fileSize}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => {
                                                                    setDocumentToDelete(doc);
                                                                    setShowDeleteDocModal(true);
                                                                }}
                                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredDocuments.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                        {categoryFilter === 'All Files' ? 'No documents uploaded yet.' : `No ${categoryFilter} documents.`}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                /* Grid View */
                                <div className="p-6">
                                    {filteredDocuments.length > 0 ? (
                                        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                                            {filteredDocuments.map((doc) => {
                                                const isPdf = doc.fileName.toLowerCase().endsWith('.pdf');
                                                const isImage = doc.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
                                                const fileSize = doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : '-';

                                                return (
                                                    <div key={doc._id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all group">
                                                        <a
                                                            href={doc.filePath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={doc.fileName}
                                                            className="block"
                                                        >
                                                            <div className="flex flex-col items-center mb-3">
                                                                <div className={`p-4 rounded-xl ${isPdf ? 'bg-rose-50' : 'bg-blue-50'} group-hover:scale-110 transition-transform mb-3`}>
                                                                    {isPdf ? <PDFIcon /> : isImage ? <ImageIcon /> : <DocIcon />}
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-center line-clamp-2 mb-1">{doc.fileName}</p>
                                                                <span className="inline-block bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">{doc.category}</span>
                                                            </div>
                                                        </a>
                                                        <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-slate-500">Uploaded by</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                                                                        {doc.uploadedBy.firstName[0]}{doc.uploadedBy.lastName[0]}
                                                                    </span>
                                                                    <span className="font-bold text-slate-900">{doc.uploadedBy.firstName}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-slate-500">Date</span>
                                                                <span className="text-slate-900 font-medium">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-slate-500">Size</span>
                                                                <span className="text-slate-900 font-medium">{fileSize}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setDocumentToDelete(doc);
                                                                    setShowDeleteDocModal(true);
                                                                }}
                                                                className="w-full mt-2 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center text-slate-500">
                                            {categoryFilter === 'All Files' ? 'No documents uploaded yet.' : `No ${categoryFilter} documents.`}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600">
                                Showing <span className="font-bold">{filteredDocuments.length > 0 ? 1 : 0}</span> to <span className="font-bold">{filteredDocuments.length}</span> of <span className="font-bold">{filteredDocuments.length}</span> results
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
                )
                }

                {/* Upload Modal */}
                {
                    showUploadModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
                                <div className="p-6 border-b border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-slate-900">Upload Documents</h3>
                                        <button
                                            onClick={() => {
                                                setShowUploadModal(false);
                                                setUploadFiles([]);
                                                setUploadCategory('General');
                                            }}
                                            className="text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Category Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Document Category <span className="text-red-500">*</span></label>
                                        <select
                                            value={uploadCategory}
                                            onChange={e => setUploadCategory(e.target.value as any)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        >
                                            <option value="General">General</option>
                                            <option value="Court Filings">Court Filings</option>
                                            <option value="Evidence">Evidence</option>
                                            <option value="Correspondence">Correspondence</option>
                                        </select>
                                    </div>

                                    {/* File Upload Area */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Files</label>
                                        <div
                                            className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                                            onClick={() => document.getElementById('modal-file-upload')?.click()}
                                        >
                                            <input
                                                type="file"
                                                id="modal-file-upload"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        setUploadFiles([...uploadFiles, ...Array.from(e.target.files)]);
                                                    }
                                                }}
                                            />
                                            <div className="group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <p className="mt-4 text-sm font-bold text-slate-900">Click to upload <span className="font-normal text-slate-500">or drag and drop</span></p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG (MAX. 10MB)</p>
                                        </div>
                                    </div>

                                    {/* File List */}
                                    {uploadFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700">Selected Files ({uploadFiles.length})</label>
                                            {uploadFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{file.name}</p>
                                                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))}
                                                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setUploadFiles([]);
                                            setUploadCategory('General');
                                        }}
                                        className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading || uploadFiles.length === 0}
                                        className={`px-6 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white shadow-md transition-all flex items-center gap-2 ${(uploading || uploadFiles.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                            }`}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Documents'}
                                        {!uploading && <CloudUploadIcon />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Delete Document Confirmation Modal */}
                {
                    showDeleteDocModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                                <div className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Document</h3>
                                    <p className="text-sm text-slate-600 text-center mb-4">
                                        Are you sure you want to delete <span className="font-bold text-slate-900">"{documentToDelete?.fileName}"</span>?
                                    </p>
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-6">
                                        <p className="text-xs text-red-800 text-center font-medium">
                                            This action cannot be undone. This will permanently delete the document.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteDocModal(false);
                                            setDocumentToDelete(null);
                                        }}
                                        disabled={deletingDoc}
                                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteDocument}
                                        disabled={deletingDoc}
                                        className="flex-1 px-4 py-2.5 bg-red-600 rounded-lg text-sm font-bold text-white hover:bg-red-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingDoc ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </PortalLayout >
    );
};

export default PortalCaseDetails;
