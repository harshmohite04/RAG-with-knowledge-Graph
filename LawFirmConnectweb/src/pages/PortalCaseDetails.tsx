import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import AIIconLogo from '../assets/ai-logo.svg';
import PortalLayout from '../components/PortalLayout';
import type { Case } from '../services/caseService';
import caseService from '../services/caseService';

const PortalCaseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseDetails = async () => {
            if (!id) return;
            try {
                const data = await caseService.getCaseById(id);
                setCaseData(data);
            } catch (error) {
                console.error("Failed to fetch case details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCaseDetails();
    }, [id]);

    // Redirect to default tab (activity) if at root case path
    useEffect(() => {
        if (!loading && caseData && location.pathname === `/portal/cases/${id}` || location.pathname === `/portal/cases/${id}/`) {
            navigate('activity', { replace: true });
        }
    }, [loading, caseData, id, location.pathname, navigate]);


    if (loading) return <PortalLayout><div>Loading...</div></PortalLayout>;
    if (!caseData) return <PortalLayout><div>Case not found</div></PortalLayout>;

    // Helper for active class
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `pb-3 text-sm font-medium transition-colors ${isActive ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`;

    return (
        <PortalLayout>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[calc(100vh-140px)] flex flex-col">

                {/* Custom Page Header */}
                <div className="border-b border-slate-200 px-6 pt-6 pb-0 bg-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-sm text-slate-500">
                                <span>Cases</span>
                                <span>/</span>
                                <span>{caseData.title}</span>
                             </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Case: {caseData.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <NavLink to="activity" className={getNavLinkClass}>Activity</NavLink>
                        <NavLink to="documents" className={getNavLinkClass}>Documents</NavLink>
                        <NavLink to="chat" className={({ isActive }) => `pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}>
                            {/* <AIIcon className={activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'} /> */}
                            {({ isActive }) => (
                                <>
                                 <img src={AIIconLogo} alt="AI" className={`w-5 h-5 ${isActive ? '' : 'grayscale opacity-50'}`} />
                                 AI
                                </>
                            )}
                        </NavLink>
                        <NavLink to="billing" className={getNavLinkClass}>Billing</NavLink>
                        <NavLink to="settings" className={getNavLinkClass}>Settings</NavLink>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <Outlet context={{ caseData, setCaseData }} />
                
            </div>
        </PortalLayout>
    );
};

export default PortalCaseDetails;
