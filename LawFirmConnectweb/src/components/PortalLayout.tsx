import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { dummyCases, dummyMessages, dummyCalendarEvents } from '../data/dummyData';

// Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)
const CaseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)

const BillingIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const BellIcon = () => (
    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)

const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<any>(null);
    const [initials, setInitials] = React.useState('U');
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any>({ cases: [], messages: [], events: [], documents: [] });
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.firstName && parsedUser.lastName) {
                setInitials(`${parsedUser.firstName[0]}${parsedUser.lastName[0]}`.toUpperCase());
            } else if (parsedUser.firstName) {
                 setInitials(parsedUser.firstName[0].toUpperCase());
            }
        }

        // Click outside to close search
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ cases: [], messages: [], events: [], documents: [] });
            return;
        }

        const query = searchQuery.toLowerCase();
        
        // Filter Cases
        const cases = dummyCases.filter((c: any) => 
            c.title.toLowerCase().includes(query) || 
            c.description.toLowerCase().includes(query) ||
            (c.clientName && c.clientName.toLowerCase().includes(query))
        ).slice(0, 3);

        // Filter Messages
        const messages = dummyMessages.filter((m: any) => 
            m.content.toLowerCase().includes(query) || 
            m.sender.toLowerCase().includes(query)
        ).slice(0, 3);

        // Filter Events
        const events = dummyCalendarEvents.filter((e: any) => 
            e.title.toLowerCase().includes(query)
        ).slice(0, 3);

        // Filter Documents (flattened from cases)
        const docs: any[] = [];
        dummyCases.forEach((c: any) => {
            if (c.documents) {
                c.documents.forEach((d: any) => {
                    if (d.name.toLowerCase().includes(query)) {
                        docs.push({ ...d, caseId: c._id, caseTitle: c.title });
                    }
                });
            }
        });

        setSearchResults({ cases, messages, events, documents: docs.slice(0, 3) });
    }, [searchQuery]);

    const isActive = (path: string) => {
        return location.pathname === path || (path !== '/portal' && location.pathname.startsWith(path));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar code remains same until Main Content Header */}
            {/* ... Sidebar ... */}
            
            <aside className="w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 flex flex-col z-10 transition-transform">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
                    {/* ... Logo SVG ... */}
                    <div className="bg-amber-900/10 p-2 rounded-lg">
                       <svg className="w-6 h-6 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2L1 21h22L12 2zm0 3.516L20.297 19H3.703L12 5.516z M11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 leading-none">Legal Partners LLP</h1>
                        <span className="text-xs text-blue-600 font-medium">Client Portal</span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-6 space-y-1">
                    <Link to="/portal" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/portal') && location.pathname === '/portal' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <HomeIcon /> Home
                    </Link>
                    <Link to="/portal/cases" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/portal/cases') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <CaseIcon /> My Cases
                    </Link>

                    <Link to="/portal/billing" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/portal/billing') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <BillingIcon /> Billing
                    </Link>
                    <Link to="/portal/calendar" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/portal/calendar') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <CalendarIcon /> Calendar
                    </Link>
                    <Link to="/portal/messages" className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/portal/messages') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <div className="flex items-center gap-3">
                            <MessageIcon /> Messages
                        </div>
                    </Link>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate('/portal/profile')}>
                            <p className="text-sm font-bold text-slate-900 truncate hover:text-blue-600 transition-colors">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role === 'lawyer' ? 'Attorney' : 'Client'}</p>
                        </div>
                       
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0">
                
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center sticky top-0 z-20">
                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-2xl relative" ref={searchRef}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    placeholder="Look for people, messages, files and more" 
                                    className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {showResults && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-[80vh] overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                    
                                    {!searchQuery.trim() ? (
                                        // Default View (Suggestions)
                                        <div className="p-4">
                                            
                                            {/* People Section */}
                                            <div className="mb-6">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">People</div>
                                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                                    {['Marcus Thorne', 'Sarah Jenkins', 'Jane Doe', 'Legal Team', 'Robert Johnson'].map((name, i) => (
                                                        <div 
                                                            key={i} 
                                                            className="flex flex-col items-center gap-1 min-w-[70px] cursor-pointer group"
                                                            onClick={() => {
                                                                // Redirect to chat with this person
                                                                navigate(`/portal/messages?contact=${name}`);
                                                                setShowResults(false);
                                                            }}
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center font-bold text-lg transition-colors ring-2 ring-white shadow-sm">
                                                                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                            </div>
                                                            <span className="text-[10px] font-medium text-slate-600 text-center leading-tight group-hover:text-blue-600">
                                                                {name.split(' ')[0]}<br/>{name.split(' ')[1]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recent/Suggested Files */}
                                             <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggestions</div>
                                                <div className="space-y-1">
                                                    {dummyCases[0].documents?.slice(0, 2).map((doc: any, i: number) => (
                                                        <div 
                                                            key={i}
                                                            onClick={() => { navigate(`/portal/cases/${dummyCases[0]._id}?tab=documents`); setShowResults(false); }}
                                                            className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                        >
                                                             <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" /></svg>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-900 group-hover:text-blue-700">{doc.name}</div>
                                                                <div className="text-xs text-slate-500">Recently modified</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                     <div 
                                                        onClick={() => { navigate(`/portal/calendar`); setShowResults(false); }}
                                                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                    >
                                                         <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                            <CalendarIcon />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900 group-hover:text-purple-700">Upcoming Hearings</div>
                                                            <div className="text-xs text-slate-500">Check your calendar</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ) : (
                                        // Results View
                                        <>
                                        {Object.values(searchResults).every((arr: any) => arr.length === 0) ? (
                                            <div className="p-8 text-center text-slate-500">
                                                No results found for "{searchQuery}"
                                            </div>
                                        ) : (
                                            <>
                                                {/* Cases */}
                                                {searchResults.cases.length > 0 && (
                                                    <div className="p-2">
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Cases</div>
                                                        {searchResults.cases.map((c: any) => (
                                                            <div 
                                                                key={c._id}
                                                                onClick={() => { navigate(`/portal/cases/${c._id}`); setShowResults(false); }}
                                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                    <CaseIcon />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-slate-900">{c.title}</div>
                                                                    <div className="text-xs text-slate-500">{c.status} • {c.clientName}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Messages */}
                                                {searchResults.messages.length > 0 && (
                                                    <div className="p-2">
                                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3   py-2">Messages</div>
                                                         {searchResults.messages.map((m: any) => (
                                                            <div 
                                                                key={m.id}
                                                                onClick={() => { navigate(`/portal/messages?contact=${m.sender}`); setShowResults(false); }} // assuming sender is contactId
                                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                                    {m.sender[0]}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between">
                                                                        <div className="text-sm font-bold text-slate-900 truncate">{m.sender}</div>
                                                                        <div className="text-xs text-slate-400">{m.time}</div>
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 truncate">{m.content}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                 {/* Documents */}
                                                 {searchResults.documents.length > 0 && (
                                                    <div className="p-2">
                                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Files</div>
                                                         {searchResults.documents.map((d: any, idx: number) => (
                                                            <div 
                                                                key={idx}
                                                                onClick={() => { navigate(`/portal/cases/${d.caseId}?tab=documents`); setShowResults(false); }}
                                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-slate-900">{d.name}</div>
                                                                    <div className="text-xs text-slate-500">In {d.caseTitle}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                  {/* Events */}
                                                  {searchResults.events.length > 0 && (
                                                    <div className="p-2">
                                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Calendar</div>
                                                         {searchResults.events.map((e: any) => (
                                                            <div 
                                                                key={e.id}
                                                                onClick={() => { navigate(`/portal/calendar`); setShowResults(false); }}
                                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                                    <CalendarIcon />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-slate-900">{e.title}</div>
                                                                    <div className="text-xs text-slate-500">{e.date} • {e.time}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                            </>
                                        )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 flex-none ml-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-500">
                             <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            <BellIcon />
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PortalLayout;
