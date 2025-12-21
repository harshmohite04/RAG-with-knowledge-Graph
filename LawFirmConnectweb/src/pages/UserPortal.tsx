import React from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';

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
const UploadIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
)
const FolderIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
)

const UserPortal: React.FC = () => {
    return (
        <PortalLayout>
                    
                    {/* Welcome & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Sarah</h2>
                            <p className="text-slate-500 mt-1">Here is the latest on your active legal matters.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                                <UploadIcon /> Upload Document
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all">
                                <MessageIcon /> Message Attorney
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Cases</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">2</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <CaseIcon />
                            </div>
                        </div>
                         <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Unread Messages</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                <MessageIcon />
                            </div>
                        </div>
                         <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Next Hearing</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">Nov 14</p>
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
                                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</a>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {/* Case 1 */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                                    <FolderIcon />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Estate Planning - Jenkins Family</h4>
                                                    <p className="text-xs text-slate-500 mt-1">Case #2023-EP-004 • Lead: Marcus Thorne</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Document Review
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                                                <span>Progress</span>
                                                <span>75% Complete</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Case 2 */}
                                     <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                                    <FolderIcon />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Property Dispute - 124 Oak St</h4>
                                                    <p className="text-xs text-slate-500 mt-1">Case #2023-PD-112 • Lead: Sarah Chen</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Discovery Phase
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                                                <span>Progress</span>
                                                <span>30% Complete</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             {/* Recent Activity */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900">Recent Activity</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Today, 10:23 AM</p>
                                                <p className="text-sm text-slate-900 font-medium">New document uploaded: "Settlement_Agreement_Draft_v2.pdf"</p>
                                            </div>
                                        </div>
                                         <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-slate-300"></div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Yesterday, 4:45 PM</p>
                                                <p className="text-sm text-slate-900 font-medium">Invoice #INV-2023-889 was generated</p>
                                                <button className="text-sm text-blue-600 font-bold mt-1 hover:text-blue-700">View Invoice</button>
                                            </div>
                                        </div>
                                         <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-slate-300"></div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Oct 24, 2:00 PM</p>
                                                <p className="text-sm text-slate-900 font-medium">Meeting scheduled with Attorney Marcus Thorne</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column (Widgets) */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Outstanding Balance */}
                            <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                                     <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
                                </div>
                                <h3 className="text-slate-300 font-medium text-sm mb-1">Outstanding Balance</h3>
                                <div className="text-4xl font-bold tracking-tight mb-4 flex items-baseline">
                                    $1,250.00 <span className="text-base font-normal text-slate-400 ml-1">USD</span>
                                </div>
                                <p className="text-xs text-slate-400 mb-6">Due by Nov 01, 2023</p>
                                <button className="w-full py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                    Pay Now
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>

                            {/* Primary Attorney */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Primary Attorney</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" 
                                        alt="Attorney" 
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-bold text-slate-900">Marcus Thorne</p>
                                        <p className="text-xs text-slate-500">Senior Partner</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        m.thorne@legalpartners.com
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        +1 (555) 123-4567
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                    View Profile
                                </button>
                            </div>

                             {/* Calendar Widget */}
                             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                     <h3 className="font-bold text-slate-900">Upcoming</h3>
                                     <a href="#" className="text-xs font-bold text-blue-600 tracking-wider">CALENDAR</a>
                                </div>
                                <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-center bg-white p-2 rounded border border-slate-200 shadow-sm min-w-[50px]">
                                        <span className="block text-xs font-bold text-blue-600 uppercase">Nov</span>
                                        <span className="block text-xl font-bold text-slate-900">14</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Court Hearing</p>
                                        <p className="text-[10px] text-slate-500">10:00 AM - Superior Court</p>
                                        <p className="text-[10px] text-slate-500">Property Dispute Case</p>
                                    </div>
                                </div>
                             </div>

                        </div>
                    </div>

        </PortalLayout>
    );
};

export default UserPortal;
