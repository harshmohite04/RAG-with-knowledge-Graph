import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PortalLayout from '../components/PortalLayout';

const CaseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)
const ClipboardIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
)
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const FilterIcon = () => (
    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
)
const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)
const LockIcon = () => (
    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
)


import type { Case } from '../services/caseService';
import caseService from '../services/caseService';

const PortalCases: React.FC = () => {
    const navigate = useNavigate();
    const [cases, setCases] = React.useState<Case[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        const fetchCases = async () => {
            try {
                const data = await caseService.getCases();
                setCases(data);
            } catch (error) {
                console.error("Failed to fetch cases", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    const filteredCases = cases.filter((c: Case) => {
        if (!c) return false;
        const matchesFilter = filter === 'All' ? true : c.status === filter;
        
        const title = c.title || '';
        const description = c.description || '';
        const id = c._id || '';
        const query = searchQuery.toLowerCase();
        
        const matchesSearch = title.toLowerCase().includes(query) || 
                              description.toLowerCase().includes(query) ||
                              id.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return <PortalLayout><div className="flex justify-center p-10">Loading Cases...</div></PortalLayout>;
    }


    return (
        <PortalLayout>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">My Legal Matters</h2>
                    <p className="text-slate-500 mt-1">Overview of your active and archived cases.</p>
                </div>
                <Link to="/portal/start-case" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all">
                    <PlusIcon /> Start New Case
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active Cases</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{cases.filter(c => c.status !== 'Closed').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600">
                        <CaseIcon />
                    </div>
                </div>
                {/* Placeholder stats */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Cases</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{cases.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-orange-500">
                        <ClipboardIcon />
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Closed Cases</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{cases.filter(c => c.status === 'Closed').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-500">
                        <CalendarIcon />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by case name or reference ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFilter('All')}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${filter === 'All' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                    >
                        <FilterIcon /> All
                    </button>
                    <button
                        onClick={() => setFilter('Open')}
                        className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${filter === 'Open' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('Closed')}
                        className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${filter === 'Closed' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                    >
                        Closed
                    </button>
                </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Case Name / Desc</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Attorney</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date Created</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Update</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">

                            {filteredCases.map((caseItem: Case) => (
                                <tr 
                                    key={caseItem._id} 
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
                                        navigate(`/portal/cases/${caseItem._id}`);
                                    }}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                                                <LockIcon />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                                    <Link to={`/portal/cases/${caseItem._id}`}>{caseItem.title}</Link>
                                                </div>
                                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{caseItem.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center group cursor-pointer">
                                            <Link to={caseItem.leadAttorney ? `/portal/messages?contact=${caseItem.leadAttorney.name}` : '#'} className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    {caseItem.leadAttorney ? caseItem.leadAttorney.name.split(' ').map((n:any) => n[0]).join('').substring(0,2).toUpperCase() : 'NA'}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 group-hover:underline transition-colors">
                                                        {caseItem.leadAttorney ? caseItem.leadAttorney.name : 'Unassigned'}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${caseItem.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                                            caseItem.status === 'Closed' ? 'bg-slate-100 text-slate-500' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {caseItem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{new Date(caseItem.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {caseItem.updatedAt ? new Date(caseItem.updatedAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/portal/cases/${caseItem._id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold transition-colors">Details</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredCases.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                        No cases found.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static for now) */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Showing <span className="font-bold">1</span> to <span className="font-bold">{filteredCases.length}</span> of <span className="font-bold">{filteredCases.length}</span> cases
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </PortalLayout>
    );
};

export default PortalCases;
