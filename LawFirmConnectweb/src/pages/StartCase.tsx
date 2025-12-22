import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import PortalLayout from '../components/PortalLayout';

// Icons
const CheckIcon = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)
const UploadIcon = () => (
    <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
)
const FamilyIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
)
const CorporateIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
)
const RealEstateIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)
const LitigationIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
)
const PhoneIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
)


const StartCase: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        files: [] as File[] // For demo UI only, real upload logic would differ
    });
    const [loading, setLoading] = useState(false);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Mapping category to backend enum if needed, but assuming exact match for now
            await api.post('/cases', {
                title: formData.title,
                description: formData.description,
                category: formData.category
            });
            navigate('/portal/cases');
        } catch (error) {
            console.error("Failed to create case", error);
            alert("Failed to create case. Please try again.");
            setLoading(false);
        }
    };

    const categories = [
        { id: 'Family Law', label: 'Family Law', desc: 'Divorce, custody, adoption', icon: <FamilyIcon /> },
        { id: 'Corporate', label: 'Corporate', desc: 'Incorporation, mergers, contracts', icon: <CorporateIcon /> },
        { id: 'Real Estate', label: 'Real Estate', desc: 'Purchase, sale, lease disputes', icon: <RealEstateIcon /> },
        { id: 'Litigation', label: 'Litigation', desc: 'Civil disputes, personal injury', icon: <LitigationIcon /> },
    ];

    return (
        <PortalLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Start a New Case</h2>
                    <p className="text-slate-500 mt-1">Please provide the initial details so we can assign the best attorney for your matter.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-10 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-10" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                    {[
                        { num: 1, label: 'Case Information' },
                        { num: 2, label: 'Upload Documents' },
                        { num: 3, label: 'Review & Submit' }
                    ].map((s) => (
                        <div key={s.num} className="flex items-center gap-3 bg-slate-50 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {step > s.num ? <CheckIcon /> : s.num}
                            </div>
                            <span className={`text-sm font-bold ${step >= s.num ? 'text-blue-900' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            
                            {/* Step 1: Case Information */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">i</div>
                                        <h3 className="text-xl font-bold text-slate-900">Case Basics</h3>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Case Name / Reference Title <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            placeholder="e.g. Purchase of 123 Main St, or Jones Family Trust"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">A short name for you to identify this matter.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Legal Matter Type <span className="text-red-500">*</span></label>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {categories.map(cat => (
                                                <div 
                                                    key={cat.id}
                                                    onClick={() => setFormData({...formData, category: cat.id})}
                                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all hover:shadow-md ${formData.category === cat.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div>{cat.icon}</div>
                                                    <div>
                                                        <h4 className={`font-bold text-sm ${formData.category === cat.id ? 'text-blue-900' : 'text-slate-900'}`}>{cat.label}</h4>
                                                        <p className="text-xs text-slate-500">{cat.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Brief Description of the Issue <span className="text-red-500">*</span></label>
                                        <textarea 
                                            rows={4}
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Please describe the situation, key events, and what outcome you are hoping to achieve..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Upload Documents */}
                             {step === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Case Documents</h3>
                                    </div>
                                    
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <UploadIcon />
                                        </div>
                                        <p className="mt-4 text-sm font-bold text-slate-900">Click to upload <span className="font-normal text-slate-500">or drag and drop</span></p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG (MAX. 10MB)</p>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
                                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                        <p className="text-xs text-blue-800">
                                            Uploading documents now helps us review your case faster. You can also upload them later in the case details portal.
                                        </p>
                                    </div>
                                </div>
                            )}

                             {/* Step 3: Review */}
                             {step === 3 && (
                                <div className="space-y-6">
                                     <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            <CheckIcon />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Review & Submit</h3>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between border-b border-slate-200 pb-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase">Case Name</p>
                                                <p className="font-bold text-slate-900">{formData.title}</p>
                                            </div>
                                            <button onClick={() => setStep(1)} className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-200 pb-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase">Category</p>
                                                <p className="font-bold text-slate-900">{formData.category}</p>
                                            </div>
                                            <button onClick={() => setStep(1)} className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Description</p>
                                            <p className="text-sm text-slate-700 leading-relaxed">{formData.description}</p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg flex gap-3 border border-green-100">
                                         <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        <p className="text-xs text-green-800 font-medium">
                                            Everything looks good! Ready to create your case.
                                        </p>
                                    </div>
                                </div>
                             )}

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
                                {step > 1 && (
                                    <button 
                                        onClick={handleBack}
                                        className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button 
                                        onClick={handleNext}
                                        disabled={!formData.title || !formData.category || !formData.description}
                                        className={`px-6 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white shadow-md transition-all ${(!formData.title || !formData.category || !formData.description) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className={`px-6 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white shadow-md transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        {loading ? 'Submitting...' : 'Create Case'}
                                        {!loading && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Info Cards */}
                    <div className="space-y-6">
                        
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-start gap-3">
                                <div className="pt-0.5 text-blue-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm mb-1">Why do we need this?</h4>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Providing detailed information helps us match you with the most qualified attorney for your specific legal needs immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="pt-0.5 text-green-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm">Secure & Confidential</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                All information submitted through this portal is encrypted and protected by attorney-client privilege.
                            </p>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Read our privacy policy</a>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Need assistance?</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                If you're unsure how to categorize your case, please give our intake team a call.
                            </p>
                             <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                <PhoneIcon />
                                +1 (555) 123-4567
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </PortalLayout>
    );
};

export default StartCase;
