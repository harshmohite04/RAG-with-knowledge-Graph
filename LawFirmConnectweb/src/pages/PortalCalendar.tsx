import React, { useState, useEffect } from 'react';
import PortalLayout from '../components/PortalLayout';
import scheduleService from '../services/scheduleService';

// Icons
const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)
const ChevronLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)
const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
)
const FilterIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
)
const CheckIcon = () => (
     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)
const UserGroupIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
)
const ClockIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const LocationIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const DescriptionIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
)
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const PortalCalendar: React.FC = () => {
    // Current date being viewed in the main week grid
    const [viewDate, setViewDate] = useState(new Date());
    // Current date focusing the mini calendar (can operate independently)
    const [miniDate, setMiniDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'WorkWeek' | 'Month'>('WorkWeek');
    const [showModal, setShowModal] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);

    // Form State
    const [eventTitle, setEventTitle] = useState('');
    const [attendees, setAttendees] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('10:00');

    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        setStartDate(todayStr);
        setEndDate(todayStr);

        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await scheduleService.getEvents();
            const adapted = data.map(evt => ({
                id: evt._id,
                title: evt.title,
                date: evt.startDate, // ISO string
                time: evt.startTime,
                allDay: evt.allDay,
                type: evt.type || 'Appointment',
                status: evt.status || 'Scheduled'
            }));
            setBookings(adapted);
        } catch (e) {
            console.error("Failed to fetch events", e);
        }
    }

    // Helper: Get days for the mini calendar grid
    const getMiniCalendarDays = (date: Date) => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0-6
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(date.getFullYear(), date.getMonth(), i));
        return days;
    };

    // Helper: Get days for the current week (Sunday to Saturday)
    const getWeekDays = (curr: Date) => {
        const week = [];
        // Determine start of week (Sunday)
        const current = new Date(curr);
        const day = current.getDay();
        const diff = current.getDate() - day; // adjust when day is sunday
        const startOfWeek = new Date(current.setDate(diff));

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    };

    // Generate hours 6 AM to 10 PM
    const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6, 7 ... 22

    const handleMiniPrev = () => setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() - 1, 1));
    const handleMiniNext = () => setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() + 1, 1));
    
    const handleMainPrev = () => {
        const d = new Date(viewDate);
        d.setDate(d.getDate() - 7);
        setViewDate(d);
    };
    const handleMainNext = () => {
        const d = new Date(viewDate);
        d.setDate(d.getDate() + 7);
        setViewDate(d);
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const startDateTime = new Date(`${startDate}T${startTime}`);
            // End Time
            const endDateTime = new Date(`${endDate}T${endTime}`);

            const newEvent: any = {
                title: eventTitle || '(No Title)',
                startDate: startDateTime.toISOString(), // Backend expects Date/ISO
                startTime: startTime,
                endDate: endDateTime.toISOString(),
                endTime: endTime,
                allDay: false,
                location,
                description,
                attendees, // string for now
                type: 'Appointment',
                status: 'Scheduled'
            };

            await scheduleService.createEvent(newEvent);
            await fetchEvents(); // Refresh
            setShowModal(false);
            
            // Reset
            setEventTitle('');
            setAttendees('');
            setLocation('');
            setDescription('');

        } catch (error) {
            console.error("Failed to create event", error);
            alert("Failed to create event");
        }
    };

    const isSameDate = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

    const weekDays = getWeekDays(viewDate);
    // If Work Week, filter out Sun/Sat (0 and 6)
    const displayDays = viewMode === 'WorkWeek' ? weekDays.filter(d => d.getDay() !== 0 && d.getDay() !== 6) : weekDays;

    return (
        <PortalLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6 overflow-hidden">
                
                {/* SIDEBAR */}
                <div className="hidden xl:flex flex-col w-64 flex-shrink-0 gap-6">
                    {/* Mini Calendar */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-800">
                                {miniDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-1">
                                <button onClick={handleMiniPrev} className="p-1 hover:bg-slate-100 rounded">
                                    <ChevronLeftIcon />
                                </button>
                                <button onClick={handleMiniNext} className="p-1 hover:bg-slate-100 rounded">
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-xs mb-2 text-slate-500">
                            {['S','M','T','W','T','F','S'].map(d => <div key={d} className="w-8">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 text-center text-xs gap-y-1">
                            {getMiniCalendarDays(miniDate).map((date, idx) => {
                                if(!date) return <div key={idx} className="w-8 h-8"></div>;
                                const isSelected = isSameDate(date, viewDate);
                                const isToday = isSameDate(date, new Date());
                                return (
                                    <button 
                                        key={idx}
                                        onClick={() => setViewDate(date)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all
                                            ${isToday ? 'bg-blue-600 text-white font-bold' : ''}
                                            ${isSelected && !isToday ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                                            ${!isToday && !isSelected ? 'hover:bg-slate-100 text-slate-700' : ''}
                                        `}
                                    >
                                        {date.getDate()}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* My Calendars Filter */}
                    <div className="bg-white rounded-lg p-0 border border-slate-000 shadow-none"> 
                        {/* Simplified as plain list to match reference style more or less */}
                        <div className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded">
                             <ChevronRightIcon /> {/* Simulated accordion arrow */}
                             <h3 className="text-sm font-bold text-slate-900">My calendars</h3>
                        </div>
                        <div className="space-y-2 pl-2">
                             <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                    <CheckIcon />
                                </div>
                                <span className="text-sm text-slate-700">Calendar</span>
                             </div>
                             <div className="flex items-center gap-3 opacity-50">
                                <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                <span className="text-sm text-slate-700">Birthdays</span>
                             </div>
                             <div className="flex items-center gap-3 opacity-50">
                                <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                <span className="text-sm text-slate-700">Holidays</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b border-slate-200 gap-4">
                         
                         {/* Left Controls */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => setViewDate(new Date())}
                                className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-bold text-slate-700 hover:bg-slate-50 bg-white shadow-sm flex items-center gap-2"
                            >
                                <CalendarIcon /> Today
                            </button>
                            <div className="flex items-center gap-1">
                                <button onClick={handleMainPrev} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600">
                                    <ChevronLeftIcon />
                                </button>
                                <button onClick={handleMainNext} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600">
                                    <ChevronRightIcon />
                                </button>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 ml-2">
                                {/* Format: Oct 22 - 26, 2023 */}
                                {displayDays[0].getDate()} - {displayDays[displayDays.length-1].getDate()} {displayDays[0].toLocaleString('default', { month: 'long' })}, {displayDays[0].getFullYear()}
                            </h2>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                                <FilterIcon />
                                <span className="hidden lg:inline">Filter applied</span>
                            </div>
                            
                            {/* View Switcher */}
                            <div className="flex bg-slate-100 rounded-md p-1">
                                <button 
                                    className={`px-3 py-1 text-xs font-bold rounded ${viewMode === 'WorkWeek' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                    onClick={() => setViewMode('WorkWeek')}
                                >
                                    Work week
                                </button>
                                <button 
                                    className={`px-3 py-1 text-xs font-bold rounded ${viewMode === 'Week' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                    onClick={() => setViewMode('Week')}
                                >
                                    Week
                                </button>
                            </div>

                            <button 
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 shadow-md flex items-center gap-2"
                            >
                                <PlusIcon /> New
                            </button>
                        </div>
                    </div>

                    {/* Week Grid */}
                    <div className="flex-1 overflow-y-auto flex relative">
                        {/* Time Column */}
                        <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 pt-10">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 text-right pr-2 text-xs text-slate-500 -mt-2.5">
                                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        <div className="flex-1 min-w-[600px] flex flex-col">
                            {/* Header Row */}
                            <div className="flex border-b border-slate-200 sticky top-0 bg-white z-10 pl-2">
                                {displayDays.map((day, idx) => {
                                    const isToday = isSameDate(day, new Date());
                                    return (
                                        <div key={idx} className="flex-1 py-3 text-center border-l border-slate-100 first:border-l-0">
                                            <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                                                {day.getDate()}
                                            </div>
                                            <div className={`text-xs uppercase font-bold ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {/* Grid Body */}
                            <div className="flex-1 flex relative">
                                {displayDays.map((day, colIdx) => {
                                    const dayEvents = bookings.filter(b => isSameDate(new Date(b.date), day));
                                    return (
                                        <div key={colIdx} className="flex-1 border-l border-slate-100 first:border-l-0 relative min-h-[1360px]"> {/* 17 hours * 80px */}
                                            {/* Horizontal lines for hours */}
                                            {hours.map((_, i) => (
                                                <div key={i} className="h-20 border-b border-slate-50 w-full absolute" style={{ top: i * 80 }}></div>
                                            ))}
                                            
                                            {/* Current Time Indicator (mocked position for demo) */}
                                            {isSameDate(day, new Date()) && (
                                                <div className="absolute w-full border-t-2 border-red-500 z-10" style={{ top: '400px' }}>
                                                    <div className="w-2 h-2 bg-red-500 rounded-full -mt-[5px] -ml-[5px]"></div>
                                                </div>
                                            )}

                                            {/* Events */}
                                            {dayEvents.map(evt => {
                                                // Just mock position based on loop index for visual variety or static 9AM if fails.
                                                const timeParts = evt.time ? evt.time.split(':') : ['09', '00'];
                                                const hour = parseInt(timeParts[0]);
                                                const minute = parseInt(timeParts[1]);
                                                
                                                const topOffset = ((hour - 6) + (minute / 60)) * 80; 
                                                
                                                return (
                                                    <div 
                                                        key={evt.id} 
                                                        className={`absolute left-1 right-1 p-2 rounded border-l-4 text-xs shadow-sm cursor-pointer hover:shadow-md transition-all
                                                            ${evt.type === 'Court' ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-indigo-50 border-indigo-500 text-indigo-800'}
                                                        `}
                                                        style={{ top: Math.max(0, topOffset), height: '70px' }}
                                                    >
                                                        <div className="font-bold truncate">{evt.title}</div>
                                                        <div className="opacity-75 truncate">{evt.time || '9:00 AM'}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Light Theme to match website as requested */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg">New Event</h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleAddEvent}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-md shadow-sm transition-colors"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>

                         <div className="p-6 space-y-5">
                            {/* Form fields reusing state */}
                            <div className="flex gap-4 items-center">
                                <div className="w-8 flex justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">Title</div>
                                <input 
                                    type="text" 
                                    placeholder="Add a title" 
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    className="flex-1 border-b-2 border-slate-200 focus:border-blue-600 pb-2 text-lg font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="w-8 flex justify-center"><UserGroupIcon /></div>
                                <input 
                                    type="text" 
                                    placeholder="Invite attendees (optional)"
                                    value={attendees}
                                    onChange={(e) => setAttendees(e.target.value)}
                                    className="flex-1 border-b border-slate-200 focus:border-blue-500 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                                />
                            </div>

                             <div className="flex gap-4 items-start">
                                <div className="w-8 flex justify-center pt-2"><ClockIcon /></div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex gap-3">
                                        <input 
                                            type="date" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                        <input 
                                            type="time" 
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <input 
                                            type="date" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                        <input 
                                            type="time" 
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="w-8 flex justify-center"><LocationIcon /></div>
                                <input 
                                    type="text" 
                                    placeholder="Add a location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)} 
                                    className="flex-1 border-b border-slate-200 focus:border-blue-500 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-8 flex justify-center pt-2"><DescriptionIcon /></div>
                                <textarea 
                                    placeholder="Add a description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3} 
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>
                         </div>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
};

export default PortalCalendar;
