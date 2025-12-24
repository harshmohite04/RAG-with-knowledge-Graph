import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// Icons defined inline for now to ensure self-containment
const SearchIconImpl = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const ListIconImpl = () => (
     <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
)
const PaperClipIconImpl = () => (
    <svg className="w-5 h-5 text-slate-400 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
)
const DownloadIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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


import { dummyActivities } from '../../data/dummyData';

interface Activity {
    id: string | number;
    caseId: string;
    title: string;
    description: string;
    date: string;
    type: string;
    user?: string;
    meta?: any;
}
interface CaseData {
    _id: string;
    title: string;
    clientName?: string;
}

const CaseActivity: React.FC = () => {
    // @ts-ignore
    const { caseData } = useOutletContext<{ caseData: CaseData }>();
    
    const [activitySearchQuery, setActivitySearchQuery] = useState('');
    const [activityTypeFilter, setActivityTypeFilter] = useState('all');
    const [activityUserFilter, setActivityUserFilter] = useState('all');
    const [localActivities, setLocalActivities] = useState<Activity[]>([]);
    
    // Activity Modal State
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [activityForm, setActivityForm] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        user: 'You'
    });

    // User Dropdown State for Modal
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    useEffect(() => {
        if (caseData) {
            setLocalActivities(dummyActivities.filter((a: any) => a.caseId === caseData._id) as unknown as Activity[]);
        }
    }, [caseData]);

    const handleAddActivity = () => {
        setShowActivityModal(true);
    };

    const handleActivitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dateTime = new Date(`${activityForm.date}T${activityForm.time}`).toISOString();
        
        const newActivity: Activity = {
            id: `act_${Date.now()}`,
            caseId: caseData?._id || '',
            title: activityForm.title,
            description: activityForm.description,
            date: dateTime,
            type: 'note_added',
            user: activityForm.user,
            meta: {}
        };

        setLocalActivities((prev: Activity[]) => [...prev, newActivity].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        // Reset and Close
        setActivityForm({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].slice(0, 5),
            user: 'You'
        });
        setShowActivityModal(false);
    };

    const allCaseActivities: Activity[] = localActivities;
    
    // Get unique users for filter dropdown
    const uniqueUsers = Array.from(new Set(allCaseActivities.map(a => a.user))).filter(Boolean);
    
    // Legal Team Data (Mock)
    const legalTeam = [
        { name: 'Jane Doe', role: 'Lead Attorney' },
        { name: 'John Smith', role: 'Paralegal' },
        { name: 'Sarah Connor', role: 'Junior Associate' }
    ];

    // Aggregate all people associated with the case for Modal Dropdown
    const casePeople = Array.from(new Set([
        ...legalTeam.map(m => m.name),
        caseData.clientName || 'Client',
        ...uniqueUsers
    ])).filter((p): p is string => !!p);


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
                if (a.user !== activityUserFilter) return false;
            }

            return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {/* Search Activity */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIconImpl />
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
                    <button 
                        onClick={handleAddActivity}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                        title="Add new activity"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden md:inline">Add</span>
                    </button>

                </div>

                {/* Activity Timeline */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    
                    {caseActivities.length === 0 && (
                            <div className="text-center py-10 relative z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                <ListIconImpl />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No activity yet</h3>
                            <p className="text-slate-500">New updates will appear here.</p>
                        </div>
                    )}

                    {caseActivities.map((activity) => (
                        <div key={activity.id} className="relative flex items-start group">
                                
                                {/* Timeline Connector Dot */}
                                <div className={`absolute left-6 -translate-x-1/2 mt-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 
                                ${activity.type === 'document_upload' ? 'bg-blue-500' :
                                    activity.type === 'payment_received' ? 'bg-emerald-500' :
                                    activity.type === 'email_received' ? 'bg-indigo-500' :
                                    'bg-slate-400'}`}>
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
                                        <div className="flex flex-col items-end">
                                            {(activity as any).user && (
                                                <span className="text-xs font-bold text-slate-900 mb-0.5">{(activity as any).user}</span>
                                            )}
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                            </span>
                                        </div>
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

            {/* Activity Modal */}
            {showActivityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Add New Activity</h3>
                            <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleActivitySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={activityForm.title}
                                    onChange={e => setActivityForm({...activityForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    placeholder="e.g. Client Call, Document Review"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    value={activityForm.description}
                                    onChange={e => setActivityForm({...activityForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    placeholder="Add details..."
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={activityForm.date}
                                        onChange={e => setActivityForm({...activityForm, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={activityForm.time}
                                        onChange={e => setActivityForm({...activityForm, time: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative group">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Done By</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={activityForm.user}
                                        onChange={e => {
                                            setActivityForm({...activityForm, user: e.target.value});
                                            setShowUserDropdown(true);
                                        }}
                                        onFocus={() => setShowUserDropdown(true)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow relative z-20 bg-transparent"
                                        placeholder="Select or type..."
                                    />
                                    {/* Dropdown Arrow */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20">
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                {showUserDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)}></div>
                                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                            {casePeople
                                                .filter(person => person.toLowerCase().includes(activityForm.user.toLowerCase()))
                                                .map((person, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition-colors flex items-center justify-between group/item"
                                                        onClick={() => {
                                                            setActivityForm({...activityForm, user: person});
                                                            setShowUserDropdown(false);
                                                        }}
                                                    >
                                                        <span className="font-medium">{person}</span>
                                                        {legalTeam.find(m => m.name === person) && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Legal Team</span>}
                                                        {person === caseData.clientName && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Client</span>}
                                                    </button>
                                                ))}
                                            
                                            {casePeople.filter(person => person.toLowerCase().includes(activityForm.user.toLowerCase())).length === 0 && (
                                                <div className="px-4 py-3 text-sm text-slate-400 italic text-center">
                                                    "{activityForm.user}" will be added as a new entry.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Attachment (Optional)</label>
                                <button type="button" onClick={() => alert('Mock Upload Triggered')} className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                                    <PaperClipIconImpl />
                                    <span className="text-sm font-medium">Click to upload files</span>
                                </button>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowActivityModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all transform active:scale-95">
                                    Add Activity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseActivity;
