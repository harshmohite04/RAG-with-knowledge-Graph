import React from 'react';
import PortalLayout from '../components/PortalLayout';

const WalletIcon = () => (
    <svg className="w-10 h-10 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 18v1a3 3 0 01-3 3H6a3 3 0 01-3-3V5.25a2.25 2.25 0 014.5 0v.51c0 1.25 1.05 2.22 2.37 2.11h9.11c1.24 0 2.2-1.05 2.11-2.29A2.25 2.25 0 0123.25 7.5V18a3 3 0 01-3 3h-2.25V9.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 012.25 5.25v-.36c0-1.24 1.05-2.2 2.29-2.11h15.21c1.25 0 2.25 1 2.25 2.25zM19.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
)
const CheckCircleIcon = () => (
    <svg className="w-10 h-10 text-emerald-100" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
)
const ClipboardClockIcon = () => (
    <svg className="w-10 h-10 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM8 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
)
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const FilterIcon = () => (
    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
)
const DownloadIcon = () => (
     <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)
const CardIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
)
const PdfIcon = () => (
    <svg className="w-5 h-5 text-slate-500 hover:text-red-500 transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
)

import { dummyBilling, dummyCases } from '../data/dummyData';

const PortalBilling: React.FC = () => {
    const [billingData] = React.useState(dummyBilling);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<'open' | 'history' | 'retainer'>('open');

    // Dynamic Stats Calculation
    const totalOutstanding = billingData
        .filter(b => b.status === 'Pending' || b.status === 'Overdue')
        .reduce((sum, b) => sum + b.amount, 0);

    const paidInvoices = billingData
        .filter(b => b.status === 'Paid')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const lastPayment = paidInvoices.length > 0 ? paidInvoices[0] : null;

    // Filter Data based on Tabs and Search
    const filteredData = billingData.filter(bill => {
        // Search Filter
        const matchesSearch = 
            bill.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
            bill.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        // Tab Filter
        if (activeTab === 'open') {
            return bill.status === 'Pending' || bill.status === 'Overdue';
        }
        if (activeTab === 'history') {
            return bill.status === 'Paid';
        }
        if (activeTab === 'retainer') {
            // Mock logic for retainer - assuming no data for now or specific description
            return false; 
        }
        return true;
    });

    const handlePayment = () => {
        alert("Redirecting to secure payment gateway...");
    };

    return (
        <PortalLayout>
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h2>
                    <p className="text-slate-500 mt-1">View your outstanding balance, manage invoices, and view payment history.</p>
                </div>
                <button 
                    onClick={handlePayment}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all">
                    <CardIcon /> Make a Payment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Outstanding */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-50">
                        <WalletIcon />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p>
                    <p className="text-4xl font-bold text-slate-900 mb-2">${totalOutstanding.toFixed(2)}</p>
                    {totalOutstanding > 0 ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            Action Required
                        </div>
                    ) : (
                         <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            All Caught Up
                        </div>
                    )}
                </div>

                {/* Last Payment */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                     <div className="absolute top-4 right-4 opacity-50">
                       <CheckCircleIcon />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Payment</p>
                    <p className="text-4xl font-bold text-slate-900 mb-2">${lastPayment ? lastPayment.amount.toFixed(2) : '0.00'}</p>
                    <p className="text-sm text-slate-500">
                        {lastPayment ? `Paid on ${new Date(lastPayment.date).toLocaleDateString()}` : 'No payments yet'}
                    </p>
                </div>

                {/* Unbilled WIP */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                     <div className="absolute top-4 right-4 opacity-50">
                        <ClipboardClockIcon />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unbilled WIP</p>
                    <p className="text-4xl font-bold text-slate-900 mb-2">$0.00</p>
                    <p className="text-sm text-slate-500">Includes current month hours</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                
                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50/50">
                    <button 
                        onClick={() => setActiveTab('open')}
                        className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'open' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-100'}`}>
                        Open Invoices
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'history' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-100'}`}>
                        Payment History
                    </button>
                    <button 
                        onClick={() => setActiveTab('retainer')}
                        className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'retainer' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-600 border-transparent hover:text-slate-800 hover:bg-slate-100'}`}>
                        Retainer Details
                    </button>
                </div>

                {/* Filters */}
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-white">
                     <div className="flex-grow relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by invoice # or matter..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <FilterIcon /> Filter
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <DownloadIcon /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice #</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date Issued</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Matter</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            
                            {filteredData.map((bill: any) => {
                                const relatedCase = dummyCases.find((c: any) => c._id === bill.caseId);
                                const dueDate = new Date(new Date(bill.date).getTime() + 14 * 24 * 60 * 60 * 1000); // Mock due date
                                
                                return (
                                    <tr key={bill.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900">#{bill.id}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm text-slate-600 font-medium">{new Date(bill.date).toLocaleDateString([], {month: 'short', day: '2-digit', year: 'numeric'})}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-500">{dueDate.toLocaleDateString([], {month: 'short', day: '2-digit', year: 'numeric'})}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-slate-900">{bill.description}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Matter: {relatedCase ? relatedCase.title : 'General'}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900">${bill.amount.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                                bill.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                                bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <PdfIcon />
                                                {bill.status !== 'Paid' && (
                                                    <button 
                                                        onClick={() => alert(`Initiating payment for ${bill.id}`)}
                                                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline">
                                                        Pay Now
                                                    </button>
                                                )}
                                                {bill.status === 'Paid' && (
                                                    <button className="text-slate-400 hover:text-slate-600 font-medium">
                                                        Receipt
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-slate-100 p-4 rounded-full mb-3">
                                                <CardIcon />
                                            </div>
                                            <p className="font-medium text-slate-900">No invoices found</p>
                                            <p className="text-sm text-slate-400 mt-1">Try adjusting filters or search query</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                 {/* Pagination - Simplified/Mock for now */}
                 <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-slate-200">
                     <p className="text-sm text-slate-600">
                        Showing <span className="font-bold">{filteredData.length > 0 ? 1 : 0}</span> to <span className="font-bold">{filteredData.length}</span> of <span className="font-bold">{filteredData.length}</span> results
                     </p>
                     <div className="flex gap-2">
                        <button disabled className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 font-medium cursor-not-allowed">Previous</button>
                        <button disabled className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 font-medium cursor-not-allowed">Next</button>
                     </div>
                 </div>

            </div>

        </PortalLayout>
    );
};

export default PortalBilling;
