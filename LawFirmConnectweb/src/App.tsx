import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Home from './pages/Home';
import PortalBilling from './pages/PortalBilling';
import PortalCalendar from './pages/PortalCalendar';
import PortalCaseDetails from './pages/PortalCaseDetails';
import PortalCases from './pages/PortalCases';
import PortalMessages from './pages/PortalMessages';
import PracticeAreas from './pages/PracticeAreas';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StartCase from './pages/StartCase';
import UserPortal from './pages/UserPortal';
import PortalProfile from './pages/PortalProfile';
import ProfileInfo from './pages/profile/ProfileInfo';
import ProfileSecurity from './pages/profile/ProfileSecurity';
import ProfileNotifications from './pages/profile/ProfileNotifications';
import CaseActivity from './pages/case-details/CaseActivity';
import CaseDocuments from './pages/case-details/CaseDocuments';
import CaseChat from './pages/case-details/CaseChat';
import CaseBilling from './pages/case-details/CaseBilling';
import CaseSettings from './pages/case-details/CaseSettings';
import { Navigate } from 'react-router-dom';

// ScrollToTop component to handle scroll position on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
}

const App: React.FC = () => {
  const { pathname } = useLocation();
  // Hide Navbar and Footer on Sign In and Portal pages
  const isAuthPage = pathname === '/signin' || pathname === '/signup' || pathname.startsWith('/portal');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 leading-normal selection:bg-blue-100 selection:text-blue-900 flex flex-col">
       {!isAuthPage && <Navbar />}
       <main className="flex-grow">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice-areas" element={<PracticeAreas />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/portal" element={<UserPortal />} />
            <Route path="/portal/cases" element={<PortalCases />} />
            <Route path="/portal/start-case" element={<StartCase />} />
            <Route path="/portal/cases/:id" element={<PortalCaseDetails />}>
                <Route index element={<Navigate to="activity" replace />} />
                <Route path="activity" element={<CaseActivity />} />
                <Route path="documents" element={<CaseDocuments />} />
                <Route path="chat" element={<CaseChat />} />
                <Route path="billing" element={<CaseBilling />} />
                <Route path="settings" element={<CaseSettings />} />
            </Route>
            <Route path="/portal/billing" element={<PortalBilling />} />
            <Route path="/portal/calendar" element={<PortalCalendar />} />
            <Route path="/portal/messages" element={<PortalMessages />} />
            <Route path="/portal/profile" element={<PortalProfile />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<ProfileInfo />} />
                <Route path="security" element={<ProfileSecurity />} />
                <Route path="notifications" element={<ProfileNotifications />} />
            </Route>
        </Routes>
       </main>
       {!isAuthPage && <Footer />}
    </div>
  );
};

const AppWrapper: React.FC = () => {
   return (
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>
   )
}

export default AppWrapper;
