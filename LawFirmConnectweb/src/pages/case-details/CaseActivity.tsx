import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import caseService, { type ActivityLog } from '../../services/caseService';

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

const CaseActivity: React.FC = () => {
    // @ts-ignore
    const { caseData, setCaseData } = useOutletContext<{ caseData: any, setCaseData: any }>();
    const { id } = useParams<{ id: string }>();
    
    const [activitySearchQuery, setActivitySearchQuery] = useState('');
    const [activityTypeFilter, setActivityTypeFilter] = useState('all');
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    
    // Activity Modal State
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [activityForm, setActivityForm] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        user: 'You'
    });

    useEffect(() => {
        const fetchActivities = async () => {
            if (id) {
                try {
                    const fetchedActivities = await caseService.getCaseActivity(id);
                    setActivities(fetchedActivities);
                } catch (error) {
                    console.error("Failed to fetch activities", error);
                }
            }
        };

        // If caseData has activityLog populated, use it primarily? 
        // Or fetch fresh. Fetching fresh is safer for updates.
        fetchActivities();
    }, [id]);

    // Derived activities list for unique user filter
    // Need to handle that performedBy might be an object or string
    const getPerformedByName = (performedBy: any) => {
        if (!performedBy) return 'Unknown';
        if (typeof performedBy === 'string') return performedBy;
        if (performedBy.firstName && performedBy.lastName) return `${performedBy.firstName} ${performedBy.lastName}`;
        return performedBy.name || 'Unknown';
    }

    const handleAddActivity = () => {
        setShowActivityModal(true);
    };

    const handleActivitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            // Note: Our backend API generally takes description and type.
            // Title is not strictly in ActivityLog schema in service, but check backend controller.
            // Backend schema: { type, description, performedBy, createdAt }
            // We might append title to description or just use description.
            
            const combinedDescription = activityForm.title 
                ? `**${activityForm.title}** - ${activityForm.description}`
                : activityForm.description;

            const newActivities = await caseService.addCaseActivity(id, {
                description: combinedDescription,
                type: 'note_added' // default type for manual entry
            });
            
            setActivities(newActivities);
            setShowActivityModal(false);
            setActivityForm({
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0].slice(0, 5),
                user: 'You'
            });
        } catch (error) {
            console.error("Failed to add activity", error);
            alert("Failed to add activity");
        }
    };

    const filteredActivities = activities
        .filter(a => {
            const userName = getPerformedByName(a.performedBy);
            
            // Search Filter
            if (activitySearchQuery) {
                const q = activitySearchQuery.toLowerCase();
                 if (!a.description.toLowerCase().includes(q) && !userName.toLowerCase().includes(q)) return false;
            }
            
            // Type Filter
            if (activityTypeFilter !== 'all') {
                if (a.type !== activityTypeFilter) return false;
            }

            return true;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
                            {/* User filter removed for now as it requires parsing unique users from dynamic data efficiently */}
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
                    
                    {filteredActivities.length === 0 && (
                            <div className="text-center py-10 relative z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                <ListIconImpl />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No activity yet</h3>
                            <p className="text-slate-500">New updates will appear here.</p>
                        </div>
                    )}

                    {filteredActivities.map((activity, index) => {
                        const performedByName = getPerformedByName(activity.performedBy);
                        
                        return (
                        <div key={activity.createdAt + index} className="relative flex items-start group">
                                
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
                                            <h4 className="font-bold text-slate-900">
                                                {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </h4>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-slate-900 mb-0.5">{performedByName}</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-slate-600 text-sm mb-4 leading-relaxed pl-[52px]">
                                        {/* Simple markdown support or text rendering */}
                                        {activity.description}
                                    </div>

                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>

            {/* Activity Modal */}
            {showActivityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Add New Note</h3>
                            <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleActivitySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title (Optional)</label>
                                <input 
                                    type="text" 
                                    value={activityForm.title}
                                    onChange={e => setActivityForm({...activityForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    placeholder="e.g. Call Summary"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    required
                                    value={activityForm.description}
                                    onChange={e => setActivityForm({...activityForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    placeholder="Add details..."
                                />
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowActivityModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all transform active:scale-95">
                                    Add Note
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
