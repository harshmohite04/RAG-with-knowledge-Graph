import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import PortalLayout from '../components/PortalLayout';
import AIIconLogo from '../assets/ai-logo.svg'
interface CaseData {
    _id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    documents: {
        name: string;
        category: string;
        date: string;
        size: string;
        uploadedBy: string;
    }[];
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
const DownloadIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)
const FileIconBlue = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 text-blue-500 ${className || ''}`} fill="currentColor" viewBox="0 0 24 24">
         <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
)
const ListIcon = () => (
     <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
)
const CheckCircleIcon = () => (
    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
)

// Document View Icons

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
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
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

import { dummyCases, dummyMessages, dummyBilling, dummyActivities } from '../data/dummyData';

// New Icons for Activity Feed
const ActivityDocIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)
const ActivityNoteIcon = () => (
    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
)
const ActivityEmailIcon = () => (
    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)
const ActivityPaymentIcon = () => (
    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const ActivityUserIcon = () => (
     <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)



const PortalCaseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState<'activity' | 'documents' | 'chat' | 'billing' | 'settings'>('activity');
    const [caseData, setCaseData] = useState<CaseData | null>(null);
    const [loading, setLoading] = useState(true);

    const [activitySearchQuery, setActivitySearchQuery] = useState('');
    const [activityTypeFilter, setActivityTypeFilter] = useState('all');
    const [activityUserFilter, setActivityUserFilter] = useState('all');

    // Document Tab State
    const [docSearchQuery, setDocSearchQuery] = useState('');
    const [docCategoryFilter, setDocCategoryFilter] = useState('All Files');
    const [docSortOrder, setDocSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [docViewMode, setDocViewMode] = useState<'list' | 'grid'>('list');

    // Expense Tab State
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseForm, setExpenseForm] = useState({
        category: 'Court Fees',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Mock Expense Added:\nCategory: ${expenseForm.category}\nAmount: ₹${expenseForm.amount}\nDate: ${expenseForm.date}`);
        setShowExpenseModal(false);
        setExpenseForm({
            category: 'Court Fees',
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleFileUpload = () => {
        if (!caseData) return;
        const newDoc = {
            name: `New_Upload_${new Date().getTime()}.pdf`,
            category: 'Correspondence',
            date: new Date().toISOString(),
            size: '0.0 MB',
            uploadedBy: 'You'
        };
        setCaseData({
            ...caseData,
            documents: [newDoc, ...caseData.documents]
        });
        alert("Document uploaded successfully (mock)!");
    };

    const handleChatAttachment = () => {
        const fileNames = ['Evidence_Photo.jpg', 'Contract_Draft_v2.pdf', 'Meeting_Notes.docx'];
        const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
        alert(`Request to attach "${randomFile}" received! In a real app, this would open the file picker.`);
    };

    React.useEffect(() => {
        // Simulate fetch
        const foundCase = dummyCases.find((c: any) => c._id === id);
        
        const timer = setTimeout(() => {
            if (foundCase) {
                setCaseData(foundCase as unknown as CaseData);
            }
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) return <PortalLayout><div>Loading...</div></PortalLayout>;
    if (!caseData) return <PortalLayout><div>Case not found</div></PortalLayout>;

    const allCaseActivities = dummyActivities.filter(a => a.caseId === caseData._id);
    
    // Get unique users for filter dropdown
    const uniqueUsers = Array.from(new Set(allCaseActivities.map(a => (a as any).user))).filter(Boolean);

    const caseActivities = allCaseActivities
        .filter(a => {
            // Search Filter
            if (activitySearchQuery) {
                const q = activitySearchQuery.toLowerCase();
                 if (!a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
            }
            
            // Type Filter
            if (activityTypeFilter !== 'all') {
                if (a.type !== activityTypeFilter) return false;
            }

            // User Filter
            if (activityUserFilter !== 'all') {
                if ((a as any).user !== activityUserFilter) return false;
            }

            return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Document Filtering and Sorting
    const filteredDocuments = caseData.documents
        .filter(doc => {
            if (docCategoryFilter !== 'All Files' && doc.category !== docCategoryFilter) return false;
            if (docSearchQuery && !doc.name.toLowerCase().includes(docSearchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return docSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

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
                                <span className="font-bold text-slate-900 capitalize">{activeTab === 'chat' ? 'AI' : activeTab}</span>
                             </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Case: {caseData.title}
                            </h1>


                        </div>
                        
                        {/* Header Actions - Removed */}
                        <div className="flex items-center gap-3"></div>
                    </div>

                    <div className="flex gap-8">
                        <button onClick={() => setActiveTab('activity')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Activity</button>
                        <button onClick={() => setActiveTab('documents')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Documents</button>
                        <button onClick={() => setActiveTab('chat')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>
                            {/* <AIIcon className={activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'} /> */}
                            <img src={AIIconLogo} alt="AI" className={`w-5 h-5 ${activeTab === 'chat' ? '' : 'grayscale opacity-50'}`} />
                            AI
                        </button>
                        <button onClick={() => setActiveTab('billing')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'billing' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Billing</button>
                        <button onClick={() => setActiveTab('settings')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Settings</button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                
                {/* 0. ACTIVITY TAB CONTENT */}
                {activeTab === 'activity' && (
                     <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                        <div className="max-w-4xl mx-auto">
                            {/* Search Activity */}
                            <div className="mb-8 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <SearchIcon />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search activity..." 
                                        value={activitySearchQuery}
                                        onChange={(e) => setActivitySearchQuery(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="flex gap-4">
                                     <select 
                                        value={activityTypeFilter}
                                        onChange={(e) => setActivityTypeFilter(e.target.value)}
                                        className="py-3 px-4 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                     >
                                         <option value="all">All Types</option>
                                         <option value="document_upload">Documents</option>
                                         <option value="note_added">Notes</option>
                                         <option value="email_received">Emails</option>
                                         <option value="payment_received">Payments</option>
                                         <option value="lawyer_assigned">Assignments</option>
                                     </select>
                                     <select
                                        value={activityUserFilter}
                                        onChange={(e) => setActivityUserFilter(e.target.value)}
                                        className="py-3 px-4 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                     >
                                        <option value="all">All Users</option>
                                        {(uniqueUsers as string[]).map(user => (
                                            <option key={user} value={user}>{user}</option>
                                        ))}
                                     </select>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                
                                {caseActivities.length === 0 && (
                                     <div className="text-center py-10 relative z-10">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                            <ListIcon />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">No activity yet</h3>
                                        <p className="text-slate-500">New updates will appear here.</p>
                                    </div>
                                )}

                                {caseActivities.map((activity) => (
                                    <div key={activity.id} className="relative flex items-start group">
                                         
                                         {/* Timeline Connector Dot */}
                                         <div className="absolute left-6 -translate-x-1/2 mt-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 
                                            ${activity.type === 'document_upload' ? 'bg-blue-500' :
                                              activity.type === 'payment_received' ? 'bg-emerald-500' :
                                              activity.type === 'email_received' ? 'bg-indigo-500' :
                                              'bg-slate-400'}">
                                         </div>

                                        <div className="ml-12 w-full">
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg 
                                                            ${activity.type === 'document_upload' ? 'bg-blue-100 text-blue-600' :
                                                              activity.type === 'payment_received' ? 'bg-emerald-100 text-emerald-600' :
                                                              activity.type === 'email_received' ? 'bg-indigo-100 text-indigo-600' : 
                                                              activity.type === 'lawyer_assigned' ? 'bg-purple-100 text-purple-600' :
                                                              'bg-slate-100 text-slate-600'}`}>
                                                            {activity.type === 'document_upload' && <ActivityDocIcon />}
                                                            {activity.type === 'payment_received' && <ActivityPaymentIcon />}
                                                            {activity.type === 'email_received' && <ActivityEmailIcon />}
                                                            {activity.type === 'note_added' && <ActivityNoteIcon />}
                                                            {activity.type === 'lawyer_assigned' && <ActivityUserIcon />}
                                                        </div>
                                                        <h4 className="font-bold text-slate-900">{activity.title}</h4>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                        {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-slate-600 text-sm mb-4 leading-relaxed pl-[52px]">
                                                    {activity.description}
                                                </p>

                                                {/* Specific Interactions based on type */}
                                                {(activity.type === 'document_upload' && activity.meta) && (
                                                    <div className="ml-[52px] bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center justify-between group-hover:border-blue-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-rose-100 p-2 rounded text-rose-500">
                                                                <PDFIcon /> 
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{activity.meta.fileName}</p>
                                                                <p className="text-xs text-slate-500">{activity.meta.fileSize} • {activity.meta.fileType}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-slate-400 hover:text-blue-600 p-2 transition-colors">
                                                            <DownloadIcon />
                                                        </button>
                                                    </div>
                                                )}

                                                {(activity.type === 'email_received' && activity.meta) && (
                                                    <div className="ml-[52px] space-y-3">
                                                        <div className="text-xs text-slate-500">
                                                            From: <span className="font-medium text-slate-900">{activity.meta.from}</span>
                                                        </div>
                                                        <div className="border-l-2 border-slate-200 pl-3 italic text-slate-500 text-sm">
                                                            {activity.meta.snippet}
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">Reply</button>
                                                            <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">Forward</button>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                {(activity.type === 'payment_received' && activity.meta && activity.meta.amount) && (
                                    <div className="ml-[52px]">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            ${activity.meta.amount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                )}
                
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
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Recent</span>
                                    </div>

                                    {dummyMessages.filter(m => m.caseId === caseData._id).map(msg => (
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
                                    
                                    {dummyMessages.filter(m => m.caseId === caseData._id).length === 0 && (
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
                )}

                {/* 2. DOCUMENTS TAB CONTENT */}
                {activeTab === 'documents' && (
                    <div className="flex-1 bg-slate-50 p-6 flex flex-col gap-6 overflow-hidden">
                        
                        {/* Action Bar */}
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search by file name..." 
                                    value={docSearchQuery}
                                    onChange={(e) => setDocSearchQuery(e.target.value)}
                                    className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <button 
                                onClick={handleFileUpload}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors">
                                <CloudUploadIcon /> Upload Document
                            </button>
                        </div>

                         {/* Filter Categories & View Options */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                                {['All Files', 'Court Filings', 'Evidence', 'Correspondence', 'Drafts'].map((cat) => (
                                    <button 
                                        key={cat}
                                        onClick={() => setDocCategoryFilter(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shadow-sm ${
                                            docCategoryFilter === cat 
                                            ? 'bg-slate-800 text-white font-bold' 
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {cat} 
                                        {cat === 'All Files' && <span className="bg-slate-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">{caseData.documents.length}</span>}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setDocSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-wide">
                                    <SortIcon /> {docSortOrder === 'newest' ? 'Newest' : 'Oldest'}
                                </button>
                                <div className="h-6 w-px bg-slate-300 mx-1"></div>
                                <div className="flex bg-slate-200 rounded-lg p-1">
                                    <button 
                                        onClick={() => setDocViewMode('grid')}
                                        className={`p-1.5 rounded shadow-sm transition-all ${docViewMode === 'grid' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700 hover:bg-white'}`}>
                                        <ViewGridIcon />
                                    </button>
                                    <button 
                                        onClick={() => setDocViewMode('list')}
                                        className={`p-1.5 rounded shadow-sm transition-all ${docViewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700 hover:bg-white'}`}>
                                        <ViewListIcon />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Documents List or Grid */}
                        <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 ${docViewMode === 'list' ? '' : 'p-6 bg-slate-50 border-none shadow-none'}`}>
                             
                             {/* GRID VIEW */}
                             {docViewMode === 'grid' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredDocuments.map((doc, index) => {
                                        const fileName = doc.name;
                                        const isPdf = fileName.toLowerCase().endsWith('.pdf');
                                        const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
                                        return (
                                            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group flex flex-col">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`p-3 rounded-xl ${isPdf ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                                        {isPdf ? <PDFIcon /> : isImage ? <ImageIcon /> : <DocIcon />}
                                                    </div>
                                                    <button className="text-slate-400 hover:text-blue-600"><DownloadIcon /></button>
                                                </div>
                                                <div className="mb-2">
                                                    <h3 className="text-sm font-bold text-slate-900 truncate" title={fileName}>{fileName}</h3>
                                                    <p className="text-xs text-slate-500">{new Date(doc.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                                        {doc.category}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">{doc.size}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                             )}

                             {/* LIST VIEW */}
                             {docViewMode === 'list' && (
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
                                            
                                            {filteredDocuments.map((doc, index) => {
                                                const fileName = doc.name;
                                                const isPdf = fileName.toLowerCase().endsWith('.pdf');
                                                const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);


                                                return (
                                                    <tr key={index} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`p-3 rounded-xl ${isPdf ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'} group-hover:scale-110 transition-transform`}>
                                                                    {isPdf ? <PDFIcon /> : isImage ? <ImageIcon /> : <DocIcon />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900 mb-0.5">{fileName}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Synced</span>
                                                                        <span className="text-[10px] text-slate-400">v1.2</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                                {doc.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                                    {doc.uploadedBy.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-700">{doc.uploadedBy}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(doc.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.size}</td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredDocuments.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="bg-slate-100 p-4 rounded-full mb-3">
                                                                <CloudUploadIcon />
                                                            </div>
                                                            <p className="font-medium text-slate-900">No documents yet</p>
                                                            <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">Upload files to share them securely with your legal team.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                             )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">{filteredDocuments.length}</span> of <span className="font-bold text-slate-900">{caseData.documents.length}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50" disabled>
                                    ← Previous
                                </button>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50" disabled>
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>

                )}

                {/* 3. BILLING TAB CONTENT */}
                {activeTab === 'billing' && (
                    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Billing & Expenses</h2>
                            <button 
                                onClick={() => setShowExpenseModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2">
                                + Add Expense
                            </button>
                         </div>

                         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                             <table className="min-w-full divide-y divide-slate-200">
                                 <thead className="bg-slate-50">
                                     <tr>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                     </tr>
                                 </thead>
                                 <tbody className="bg-white divide-y divide-slate-200">
                                     {dummyBilling.filter(b => b.caseId === caseData._id).map((bill) => (
                                         <tr key={bill.id}>
                                             <td className="px-6 py-4 text-sm font-medium text-slate-900">{bill.id}</td>
                                             <td className="px-6 py-4 text-sm text-slate-600">{new Date(bill.date).toLocaleDateString()}</td>
                                             <td className="px-6 py-4 text-sm text-slate-600">{bill.description}</td>
                                             <td className="px-6 py-4 text-sm font-bold text-slate-900">${bill.amount.toFixed(2)}</td>
                                             <td className="px-6 py-4">
                                                 <span className={`px-2 py-1 rounded text-xs font-bold ${bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                     {bill.status}
                                                 </span>
                                             </td>
                                         </tr>
                                     ))}
                                      {dummyBilling.filter(b => b.caseId === caseData._id).length === 0 && (
                                         <tr>
                                             <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No billing records found.</td>
                                         </tr>
                                     )}
                                 </tbody>
                             </table>
                         </div>

                         {/* Add Expense Modal */}
                         {showExpenseModal && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-bold text-lg text-slate-900">Add New Expense</h3>
                                        <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Expense Category</label>
                                            <select 
                                                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={expenseForm.category}
                                                onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                                            >
                                                <option>Court Fees</option>
                                                <option>Stamp Duty</option>
                                                <option>Notary Charges</option>
                                                <option>Filing Fees</option>
                                                <option>Clerk Charges</option>
                                                <option>Typing / Photocopy</option>
                                                <option>Travel / Conveyance</option>
                                                <option>Others</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                            <textarea 
                                                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-20"
                                                placeholder="Enter expense details..."
                                                value={expenseForm.description}
                                                onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Amount (₹)</label>
                                                <input 
                                                    type="number" 
                                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    value={expenseForm.amount}
                                                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    required
                                                    value={expenseForm.date}
                                                    onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Receipt Upload</label>
                                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => alert('Mock file picker opened')}>
                                                <div className="text-blue-500 mb-1 mx-auto"><PDFIcon /></div>
                                                <p className="text-xs text-slate-500">Click to upload Receipt (Image/PDF)</p>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95">
                                                Add Expense
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                         )}
                    </div>
                )}

                {/* 4. SETTINGS TAB CONTENT */}
                {activeTab === 'settings' && (
                    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                        <div className="max-w-4xl mx-auto space-y-8">
                            
                            {/* General Settings */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                    <h3 className="font-bold text-slate-900">General Settings</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Case Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={caseData.title}
                                            className="block w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Case Description</label>
                                        <textarea 
                                            defaultValue={caseData.description}
                                            rows={3}
                                            className="block w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-bold text-slate-700 mb-1">Status</label>
                                            <span className="text-xs text-slate-500">Current state of the legal matter</span>
                                        </div>
                                        <select 
                                            defaultValue={caseData.status}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            onChange={(e) => alert(`Status changed to: ${e.target.value}`)}
                                        >
                                            <option value="Open">Open</option>
                                            <option value="Pending">Pending Review</option>
                                            <option value="OnHold">On Hold</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end pt-4 border-t border-slate-100">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Email Updates</h4>
                                            <p className="text-xs text-slate-500">Receive emails about new documents and messages</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">SMS Alerts</h4>
                                            <p className="text-xs text-slate-500">Get text messages for urgent deadlines</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Team Management */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Team Management</h3>
                                    <button 
                                        className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors"
                                        onClick={() => alert("Add Member Modal would open here")}
                                    >
                                        + Add Member
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {[
                                        { name: 'Jane Doe', role: 'Lead Attorney', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100' },
                                        { name: 'John Smith', role: 'Paralegal', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100' },
                                        { name: 'Sarah Connor', role: 'Junior Associate', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100' }
                                    ].map((member, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={member.img} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                    <p className="text-xs text-slate-500">{member.role}</p>
                                                </div>
                                            </div>
                                            <button 
                                                className="text-slate-400 hover:text-red-600 text-sm font-medium transition-colors"
                                                onClick={() => alert(`Remove ${member.name}?`)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 rounded-xl border border-red-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-red-700">Delete Case</h3>
                                    <p className="text-sm text-red-600/80 mt-1">This action cannot be undone. All documents and messages will be permanently removed.</p>
                                </div>
                                <button 
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm whitespace-nowrap"
                                    onClick={() => alert("Are you sure you want to delete this case? This action is irreversible.")}
                                >
                                    Delete Case
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
