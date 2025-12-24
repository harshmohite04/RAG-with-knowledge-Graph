import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

// Icons
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)
const CloudUploadIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
const DownloadIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)


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

const CaseDocuments: React.FC = () => {
    // @ts-ignore
    const { caseData, setCaseData } = useOutletContext<{ caseData: CaseData, setCaseData: any }>();

    // Document Tab State
    const [docSearchQuery, setDocSearchQuery] = useState('');
    const [docCategoryFilter, setDocCategoryFilter] = useState('All Files');
    const [docSortOrder, setDocSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [docViewMode, setDocViewMode] = useState<'list' | 'grid'>('list');

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

    // Document Filtering and Sorting
    const filteredDocuments = caseData?.documents
        .filter(doc => {
            if (docCategoryFilter !== 'All Files' && doc.category !== docCategoryFilter) return false;
            if (docSearchQuery && !doc.name.toLowerCase().includes(docSearchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return docSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        }) || [];

    return (
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
                            {cat === 'All Files' && <span className="bg-slate-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">{caseData?.documents.length}</span>}
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
                    Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">{filteredDocuments.length}</span> of <span className="font-bold text-slate-900">{caseData?.documents.length}</span> results
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
    );
};

export default CaseDocuments;
