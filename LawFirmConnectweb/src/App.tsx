import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PracticeAreas from './pages/PracticeAreas';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import SignIn from './pages/SignIn';

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
  // Hide Navbar and Footer on Sign In page for cleaner look? 
  // User didn't explicitly ask, but typical for sign in pages. 
  // Let's keep them hidden for Sign In to match the "split screen" design which has its own branding.
  const isAuthPage = pathname === '/signin';

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
