import React, { useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import caseService from '../../services/caseService';
import ragService from '../../services/ragService';
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
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

const CaseDocuments: React.FC = () => {
    // @ts-ignore
    const { caseData, setCaseData } = useOutletContext<{ caseData: any, setCaseData: any }>();
    const { id } = useParams<{ id: string }>();

    // Document Tab State
    const [docSearchQuery, setDocSearchQuery] = useState('');
    const [docCategoryFilter, setDocCategoryFilter] = useState('All Files');
    const [docSortOrder, setDocSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [docViewMode, setDocViewMode] = useState<'list' | 'grid'>('list');
    const [uploading, setUploading] = useState(false);

    // Multi-Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<{ file: File; category: string; id: string }[]>([]);
    
    // Viewer State
    const [selectedDocument, setSelectedDocument] = useState<any>(null);

    const uploadCategories = ['Case Filing', 'Evidence', 'Correspondence', 'General'];

    const handleOpenUploadModal = () => {
        setIsUploadModalOpen(true);
        setPendingFiles([]);
    };

    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(f => ({
                file: f,
                category: 'General',
                id: Math.random().toString(36).substr(2, 9)
            }));
            setPendingFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemovePendingFile = (id: string) => {
        setPendingFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleCategoryChange = (id: string, newCategory: string) => {
        setPendingFiles(prev => prev.map(f => f.id === id ? { ...f, category: newCategory } : f));
    };

    const handleUploadAll = async () => {
        if (!id || pendingFiles.length === 0) return;
        
        setUploading(true);
        try {
            // Upload files in parallel
            // Upload files sequentially to avoid backend race conditions
            for (const pf of pendingFiles) {
                const formData = new FormData();
                formData.append('files', pf.file);
                formData.append('category', pf.category);
                
                // 1. Upload to Node.js Backend (Storage)
                await caseService.uploadDocument(id, formData);

                // 2. Ingest into RAG System (AI)
                try {
                    await ragService.ingestDocument(id, pf.file);
                    console.log(`[RAG] Ingested ${pf.file.name}`);
                } catch (ragError) {
                    console.error(`[RAG] Failed to ingest ${pf.file.name}`, ragError);
                    // Decide if we want to block or just warn. 
                    // For now, we log but don't stop the UI success state since storage succeeded.
                }
            }

            // Refresh docs (naive re-fetch or rely on the last response)
            // Ideally we should just append all new docs. 
            // For simplicity, let's just re-fetch the whole list to be safe or just alert.
            // But we can also use the results.
            const results = await caseService.getCaseDocuments(id);
            setCaseData((prev: any) => ({ ...prev, documents: results }));
            
            alert("All documents uploaded successfully!");
            setIsUploadModalOpen(false);
            setPendingFiles([]);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Some uploads failed. Please check the list and try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        if (!id || !window.confirm("Are you sure you want to delete this document?")) return;
        try {
            await caseService.deleteDocument(id, docId);
            // Optimistic update or re-fetch
            const updatedDocs = caseData.documents.filter((d: any) => d._id !== docId);
            setCaseData({ ...caseData, documents: updatedDocs });
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete document.");
        }
    };

    // Document Filtering and Sorting (Adapting to backend fields)
    const filteredDocuments = (caseData?.documents || [])
        .filter((doc: any) => {
            if (docCategoryFilter !== 'All Files' && doc.category !== docCategoryFilter) return false;
            // doc.name -> doc.fileName
            if (docSearchQuery && !doc.fileName.toLowerCase().includes(docSearchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a: any, b: any) => {
            const dateA = new Date(a.uploadedAt).getTime();
            const dateB = new Date(b.uploadedAt).getTime();
            return docSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

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
                    onClick={handleOpenUploadModal}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors disabled:opacity-50">
                    <CloudUploadIcon /> {uploading ? 'Processing...' : 'Upload Document'}
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
                        {filteredDocuments.map((doc: any, index: number) => {
                            const fileName = doc.fileName;
                            const isPdf = fileName.toLowerCase().endsWith('.pdf');
                            const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
                            return (
                                <div key={doc._id || index} onClick={() => setSelectedDocument(doc)} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group flex flex-col cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-3 rounded-xl ${isPdf ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {isPdf ? <PDFIcon /> : isImage ? <ImageIcon /> : <DocIcon />}
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="text-slate-400 hover:text-blue-600 p-1"><DownloadIcon /></button>
                                            <button onClick={() => handleDeleteDocument(doc._id)} className="text-slate-400 hover:text-red-600 p-1"><TrashIcon /></button>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <h3 className="text-sm font-bold text-slate-900 truncate" title={fileName}>{fileName}</h3>
                                        <p className="text-xs text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                            {doc.category}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}</span>
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                
                                {filteredDocuments.map((doc: any, index: number) => {
                                    const fileName = doc.fileName;
                                    const isPdf = fileName.toLowerCase().endsWith('.pdf');
                                    const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
                                    
                                    const uploadedByName = doc.uploadedBy ? 
                                        (typeof doc.uploadedBy === 'string' ? doc.uploadedBy : `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`) 
                                        : 'Unknown';
                                    
                                    const uploadedByInitials = doc.uploadedBy && typeof doc.uploadedBy === 'object' ? 
                                         `${doc.uploadedBy.firstName[0]}${doc.uploadedBy.lastName[0]}` : 'U';

                                    return (
                                        <tr key={doc._id || index} onClick={() => setSelectedDocument(doc)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl ${isPdf ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'} group-hover:scale-110 transition-transform`}>
                                                        {isPdf ? <PDFIcon /> : isImage ? <ImageIcon /> : <DocIcon />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 mb-0.5">{fileName}</p>
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
                                                        {uploadedByInitials}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{uploadedByName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc._id); }} className="text-slate-400 hover:text-red-600 p-2 transition-colors" title="Delete">
                                                    <TrashIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredDocuments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
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
            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Upload Documents</h3>
                            <button 
                                onClick={() => setIsUploadModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* File Drop / Select Area */}
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative">
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={handleFileSelection}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <CloudUploadIcon />
                                </div>
                                <p className="text-slate-900 font-bold mb-1">Click to browse or drag files here</p>
                                <p className="text-xs text-slate-500">Support for PDF, DOCX, JPG, PNG</p>
                            </div>

                            {/* Pending Files List */}
                            {pendingFiles.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Selected Files ({pendingFiles.length})</h4>
                                    {pendingFiles.map((pf) => (
                                        <div key={pf.id} className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                                <DocIcon />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">{pf.file.name}</p>
                                                <p className="text-xs text-slate-500">{(pf.file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            
                                            {/* Category Selector */}
                                            <div className="w-40">
                                                <select
                                                    value={pf.category}
                                                    onChange={(e) => handleCategoryChange(pf.id, e.target.value)}
                                                    className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {uploadCategories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button 
                                                onClick={() => handleRemovePendingFile(pf.id)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-50"
                                                title="Remove file"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsUploadModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUploadAll}
                                disabled={pendingFiles.length === 0 || uploading}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        Upload {pendingFiles.length > 0 ? `${pendingFiles.length} Files` : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Document Viewer Modal */}
            {selectedDocument && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{selectedDocument.fileName}</h3>
                                <p className="text-xs text-slate-500">
                                    {selectedDocument.category} • Uploaded by {selectedDocument.uploadedBy?.firstName || 'Unknown'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a 
                                    href={selectedDocument.filePath.startsWith('http') ? selectedDocument.filePath : `http://localhost:5000${selectedDocument.filePath}`} 
                                    download={selectedDocument.fileName}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <DownloadIcon /> Download
                                </a>
                                <button 
                                    onClick={() => setSelectedDocument(null)}
                                    className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors font-bold text-xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-auto relative">
                            {(() => {
                                const url = selectedDocument.filePath.startsWith('http') 
                                    ? selectedDocument.filePath 
                                    : `http://localhost:5000${selectedDocument.filePath}`;
                                
                                const ext = selectedDocument.fileName.split('.').pop().toLowerCase();
                                
                                if (['pdf'].includes(ext)) {
                                    return (
                                        <iframe 
                                            src={url} 
                                            className="w-full h-full rounded-lg shadow-sm bg-white" 
                                            title="Document Preview"
                                        />
                                    );
                                } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                                    return (
                                        <img 
                                            src={url} 
                                            alt={selectedDocument.fileName} 
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm" 
                                        />
                                    );
                                } else if (['txt'].includes(ext)) {
                                    return (
                                        <iframe 
                                            src={url} 
                                            className="w-full h-full rounded-lg shadow-sm bg-white" 
                                            title="Text Preview"
                                        />
                                    );
                                } else {
                                    return (
                                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <DocIcon />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-2">Preview not available</h4>
                                            <p className="text-slate-500 mb-6">This file type cannot be previewed in the browser.</p>
                                            <a 
                                                href={url}
                                                download 
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                                            >
                                                <DownloadIcon /> Download File
                                            </a>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseDocuments;
