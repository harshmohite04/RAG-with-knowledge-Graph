import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import caseService from '../services/caseService';
import type { Case, ActivityLog } from '../services/caseService';
import scheduleService from '../services/scheduleService';
import type { CalendarEvent } from '../services/scheduleService';

// Icons
const CaseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)
const MessageIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
)

const FolderIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
)

import { messageService } from '../services/messageService';

const UserPortal: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [activeCases, setActiveCases] = useState<Case[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [upcomingBooking, setUpcomingBooking] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching dashboard data...");
                // User Name
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        setUserName(user.firstName || 'User');
                    } catch (e) {
                         console.error("Failed to parse user", e);
                         setUserName("User");
                    }
                } else {
                    setUserName('Client');
                }

                // 1. Fetch Cases
                let activeCount = 0;
                let recentCases: Case[] = [];
                try {
                    const casesData = await caseService.getCases();
                    if (Array.isArray(casesData)) {
                        const openCases = casesData.filter(c => c.status !== 'Closed');
                        activeCount = openCases.length;
                        
                        // Get most recent active cases
                        recentCases = openCases
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 2);
                        
                        setActiveCases(recentCases);
                    } else {
                        console.error("getCases returned non-array:", casesData);
                    }
                } catch (err) {
                    console.error("Failed to fetch cases:", err);
                }

                // 2. Fetch Activities for recent cases
                let allActivities: ActivityLog[] = [];
                if (recentCases.length > 0) {
                    try {
                        const activityPromises = recentCases.map(c => caseService.getCaseActivity(c._id));
                        const results = await Promise.all(activityPromises);
                        results.forEach(logs => {
                            if (Array.isArray(logs)) {
                                allActivities = [...allActivities, ...logs];
                            }
                        });
                        
                        // Sort by date desc
                        allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        allActivities = allActivities.slice(0, 5); // Top 5
                    } catch (e) {
                        console.error("Failed to fetch activities", e);
                    }
                }
                setActivities(allActivities);

                // 3. Fetch Unread Messages Count
                let unreadCount = 0;
                try {
                    const msgData = await messageService.getUnreadCount();
                    unreadCount = msgData.count || 0;
                } catch (e) {
                    console.error("Failed to fetch message count", e);
                }
                
                // 4. Fetch Calendar Events
                let nextEventDate: Date | null = null;
                try {
                    const eventsData = await scheduleService.getEvents();
                    if (Array.isArray(eventsData)) {
                        const now = new Date();
                        
                        const futureEvent = eventsData.find((e: CalendarEvent) => {
                             if (!e.startDate || !e.startTime) return false;
                             try {
                                 // Handle date string processing carefully
                                 const startStr = typeof e.startDate === 'string' ? e.startDate.split('T')[0] : new Date(e.startDate).toISOString().split('T')[0];
                                 const eventDate = new Date(`${startStr}T${e.startTime}`);
                                 return eventDate > now;
                             } catch (err) {
                                 return false;
                             }
                        });
    
                        if (futureEvent) {
                             const startStr = typeof futureEvent.startDate === 'string' ? futureEvent.startDate.split('T')[0] : new Date(futureEvent.startDate).toISOString().split('T')[0];
                             nextEventDate = new Date(`${startStr}T${futureEvent.startTime}`);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch events", e);
                }

                setStats({
                    activeCases: activeCount,
                    unreadMessages: unreadCount,
                });

                setUpcomingBooking(nextEventDate);
                setLoading(false);

            } catch (globalError: any) {
                console.error("Critical error loading dashboard", globalError);
                setError(globalError.message || "Unknown error");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <PortalLayout><div className="flex justify-center p-10">Loading Dashboard...</div></PortalLayout>;
    }

    if (error) {
         return <PortalLayout><div className="p-10 text-red-600">Error loading dashboard: {error}</div></PortalLayout>;
    }

    return (
        <PortalLayout>
                    
                    {/* Welcome & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {userName}</h2>
                            <p className="text-slate-500 mt-1">Here is the latest on your active legal matters.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Cases</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.activeCases || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <CaseIcon />
                            </div>
                        </div>
                         <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Unread Messages</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.unreadMessages || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                <MessageIcon />
                            </div>
                        </div>
                         <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Next Hearing</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    {upcomingBooking && !isNaN(upcomingBooking.getTime()) 
                                        ? upcomingBooking.toLocaleDateString([], { month: 'short', day: 'numeric' }) 
                                        : 'None'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <CalendarIcon />
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Split View */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column (Main) */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Active Matters */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900">Active Matters</h3>
                                    <Link to="/portal/cases" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {activeCases && activeCases.map((caseItem: Case) => (
                                        <div className="p-6" key={caseItem._id}>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                                        <FolderIcon />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{caseItem.title}</h4>
                                                        <p className="text-xs text-slate-500 mt-1">Status: {caseItem.status} • {caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {caseItem.status}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>In Progress</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {activeCases.length === 0 && (
                                        <div className="p-6 text-center text-slate-500">No active cases found.</div>
                                    )}
                                </div>
                            </div>

                             {/* Recent Activity */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900">Recent Activity</h3>
                                </div>
                                <div className="p-6">
                                     <div className="space-y-4">
                                         {activities && activities.map((act, idx) => (
                                             <div className="flex items-start gap-3" key={idx}>
                                                 <div className={`w-2 h-2 rounded-full mt-2 ${idx % 2 === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                                 <div>
                                                     <p className="text-sm text-slate-900">{act.description}</p>
                                                     <p className="text-xs text-slate-500">{new Date(act.createdAt).toLocaleString()}</p>
                                                 </div>
                                             </div>
                                         ))}
                                         {activities.length === 0 && (
                                             <div className="text-sm text-slate-500">No recent activity.</div>
                                         )}
                                     </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column (Widgets) */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Calendar Widget */}
                             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                     <h3 className="font-bold text-slate-900">Upcoming</h3>
                                     <Link to="/portal/calendar" className="text-xs font-bold text-blue-600 tracking-wider">CALENDAR</Link>
                                </div>
                                {upcomingBooking && !isNaN(upcomingBooking.getTime()) ? (
                                    <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="text-center bg-white p-2 rounded border border-slate-200 shadow-sm min-w-[50px]">
                                            <span className="block text-xs font-bold text-blue-600 uppercase">{upcomingBooking.toLocaleDateString([], { month: 'short' })}</span>
                                            <span className="block text-xl font-bold text-slate-900">{upcomingBooking.getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Appointment</p>
                                            <p className="text-[10px] text-slate-500">
                                                {upcomingBooking.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">No upcoming appointments.</p>
                                )}
                             </div>
                             
                        </div>
                    </div>

        </PortalLayout>
    );
};

export default UserPortal;
