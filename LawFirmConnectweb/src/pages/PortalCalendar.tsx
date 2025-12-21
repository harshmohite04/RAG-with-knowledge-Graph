import React from 'react';
import PortalLayout from '../components/PortalLayout';


const ChevronLeftIcon = () => (
    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)

const ChevronRightIcon = () => (
    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
)

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)

const PortalCalendar: React.FC = () => {
    // Mock Data for Calendar
    const days = [
        { day: 29, currentMonth: false, events: [] },
        { day: 30, currentMonth: false, events: [] },
        { day: 1, currentMonth: true, events: [] },
        { day: 2, currentMonth: true, events: [] },
        { day: 3, currentMonth: true, events: [
            { id: 1, title: "Doc Submission", color: "bg-red-100 text-red-800 border-red-200" }
        ] },
        { day: 4, currentMonth: true, events: [] },
        { day: 5, currentMonth: true, events: [] },
        
        { day: 6, currentMonth: true, events: [] },
        { day: 7, currentMonth: true, events: [] },
        { day: 8, currentMonth: true, events: [] },
        { day: 9, currentMonth: true, events: [] },
        { day: 10, currentMonth: true, events: [
             { id: 2, title: "Prelim. Hearing", color: "bg-blue-100 text-blue-800 border-blue-200" }
        ] },
        { day: 11, currentMonth: true, events: [] },
        { day: 12, currentMonth: true, dateColor: 'bg-blue-600 text-white shadow-md', events: [
             { id: 3, title: "Atty. Smith Mtg.", color: "bg-emerald-100 text-emerald-800 border-emerald-200" }
        ] },

        { day: 13, currentMonth: true, events: [] },
        { day: 14, currentMonth: true, events: [] },
        { day: 15, currentMonth: true, events: [] },
        { day: 16, currentMonth: true, events: [] },
        { day: 17, currentMonth: true, events: [] },
        { day: 18, currentMonth: true, events: [] },
        { day: 19, currentMonth: true, events: [] },

        { day: 20, currentMonth: true, events: [] },
        { day: 21, currentMonth: true, events: [] },
        { day: 22, currentMonth: true, events: [
             { id: 4, title: "Superior Court...", color: "bg-blue-100 text-blue-800 border-blue-200" }
        ] },
        { day: 23, currentMonth: true, events: [] },
        { day: 24, currentMonth: true, events: [] },
        { day: 25, currentMonth: true, events: [] },
        { day: 26, currentMonth: true, events: [
             { id: 5, title: "Evidence List ...", color: "bg-red-100 text-red-800 border-red-200" }
        ] },

        { day: 27, currentMonth: true, events: [] },
        { day: 28, currentMonth: true, events: [] },
        { day: 29, currentMonth: true, events: [] },
        { day: 30, currentMonth: true, events: [] },
        { day: 31, currentMonth: true, events: [] },
        { day: 1, currentMonth: false, events: [] },
        { day: 2, currentMonth: false, events: [] },
    ];

    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <PortalLayout>
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Case Calendar</h2>
                    <p className="text-slate-500 mt-1">Track your upcoming court dates, deadlines, and appointments.</p>
                </div>
                <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                    <button className="px-4 py-1.5 text-sm font-bold bg-blue-600 text-white rounded shadow-sm">Month</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">Week</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">Day</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Main Calendar Grid */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Calendar Settings / Navigation */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-slate-900">October 2023</h3>
                            <div className="flex gap-1">
                                <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeftIcon /></button>
                                <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"><ChevronRightIcon /></button>
                            </div>
                        </div>
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                            Today
                        </button>
                    </div>

                    {/* Week Header */}
                    <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 auto-rows-fr h-[600px]">
                        {days.map((d, index) => (
                            <div 
                                key={index} 
                                className={`border-b border-r border-slate-100 p-2 min-h-[100px] relative hover:bg-slate-50/50 transition-colors ${!d.currentMonth ? 'bg-slate-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${d.dateColor ? d.dateColor : (!d.currentMonth ? 'text-slate-400' : 'text-slate-700')}`}>
                                        {d.day}
                                    </span>
                                </div>
                                
                                <div className="space-y-1">
                                    {d.events.map((event, i) => (
                                        <div key={i} className={`text-[10px] px-2 py-1 rounded truncate border ${event.color} cursor-pointer hover:opacity-80`}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* Fill Borders fixes: rightmost border and bottom border logic is handled by grid, but last elements might need border adjustment if using simple borders. Tailwind grid gap approach or specific border classes usually handle this nicely. Here utilizing border-r and border-b on cells. */}
                    </div>
                     <div className="p-4 border-t border-slate-200 flex items-center gap-6 text-xs font-medium text-slate-600 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Court Dates
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Deadlines
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Appointments
                        </div>
                     </div>
                </div>

                {/* Right Sidebar */}
                 <div className="lg:col-span-1 space-y-6">
                    
                    {/* Upcoming Schedule */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-6">Upcoming Schedule</h3>
                        <div className="space-y-6">
                            
                            {/* Item 1 - Today */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex flex-col items-center justify-center border border-emerald-100">
                                    <span className="text-[9px] font-bold text-emerald-600 uppercase">TODAY</span>
                                    <span className="text-lg font-bold text-slate-900 leading-none">12</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Strategy Meeting</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">2:00 PM • Zoom Conference</p>
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold tracking-wide rounded">Meeting</span>
                                </div>
                            </div>

                             {/* Item 2 */}
                             <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                                    <span className="text-[9px] font-bold text-blue-600 uppercase">OCT</span>
                                    <span className="text-lg font-bold text-slate-900 leading-none">15</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Deposition Prep</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">10:00 AM • Main Office</p>
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] uppercase font-bold tracking-wide rounded">Court Prep</span>
                                </div>
                            </div>

                             {/* Item 3 */}
                             <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                                    <span className="text-[9px] font-bold text-red-600 uppercase">OCT</span>
                                    <span className="text-lg font-bold text-slate-900 leading-none">22</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Superior Court Hearing</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">9:00 AM • Courtroom 3B</p>
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] uppercase font-bold tracking-wide rounded">Appearance</span>
                                </div>
                            </div>

                        </div>
                        <button className="w-full mt-8 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                            View Full Schedule
                        </button>
                    </div>

                    {/* Request Appointment CTA */}
                     <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white text-center">
                        <h3 className="font-bold text-lg mb-2">Need to schedule a meeting?</h3>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                            You can request an appointment directly with your attorney through the portal.
                        </p>
                        <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <PlusIcon /> Request Appointment
                        </button>
                     </div>

                 </div>

            </div>

        </PortalLayout>
    );
};

export default PortalCalendar;
