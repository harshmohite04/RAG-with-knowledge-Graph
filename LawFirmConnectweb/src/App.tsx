import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PracticeAreas from './pages/PracticeAreas';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import SignIn from './pages/SignIn';
import UserPortal from './pages/UserPortal';
import PortalCases from './pages/PortalCases';
import PortalBilling from './pages/PortalBilling';
import PortalCalendar from './pages/PortalCalendar';
import PortalMessages from './pages/PortalMessages';
import PortalCaseDetails from './pages/PortalCaseDetails';

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
  const isAuthPage = pathname === '/signin' || pathname.startsWith('/portal');

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
            <Route path="/portal" element={<UserPortal />} />
            <Route path="/portal/cases" element={<PortalCases />} />
            <Route path="/portal/cases/:id" element={<PortalCaseDetails />} />
            <Route path="/portal/billing" element={<PortalBilling />} />
            <Route path="/portal/calendar" element={<PortalCalendar />} />
            <Route path="/portal/messages" element={<PortalMessages />} />
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
